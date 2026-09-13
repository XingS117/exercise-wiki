import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const out = {};

async function check(w, h, label) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR: ' + e.message));
  await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.hero__wall-card', { timeout: 20000 });
  await p.waitForTimeout(800);

  const r = await p.evaluate(() => {
    const hero = document.querySelector('.hero');
    const inner = document.querySelector('.hero__inner');
    const content = document.querySelector('.hero__content');
    const wall = document.querySelector('.hero__wall');
    const card = document.querySelector('.hero__wall-card');
    const hb = hero.getBoundingClientRect();
    const wb = wall.getBoundingClientRect();
    const cb = content.getBoundingClientRect();
    const grid = getComputedStyle(inner).gridTemplateColumns;
    return {
      heroBg: getComputedStyle(hero).backgroundImage.slice(0, 40),
      heroRadius: getComputedStyle(hero).borderRadius,
      wallCards: document.querySelectorAll('.hero__wall-card').length,
      wallCols: getComputedStyle(wall).gridTemplateColumns,
      wallX: Math.round(wb.left), wallRight: Math.round(wb.right), wallW: Math.round(wb.width),
      contentRight: Math.round(cb.right),
      titleColor: getComputedStyle(document.querySelector('.hero__title')).color,
      imgFilter: getComputedStyle(document.querySelector('.hero__wall-img')).filter,
      heroW: Math.round(hb.width),
      noise: !!document.querySelector('.hero') && getComputedStyle(document.querySelector('.hero'), '::after').backgroundImage !== 'none',
    };
  });
  // hover 变彩验证
  await p.hover('.hero__wall-card >> nth=0');
  await p.waitForTimeout(600);
  r.hoverGifOpacity = await p.$eval('.hero__wall-card >> nth=0 >> .hero__wall-gif', el => getComputedStyle(el).opacity);
  r.hoverTransform = await p.$eval('.hero__wall-card >> nth=0', el => getComputedStyle(el).transform);
  out[label] = { ...r, errs };
  await p.close();
}

await check(1280, 900, 'desktop');
await check(390, 844, 'mobile');
console.log(JSON.stringify(out, null, 2));
await browser.close();
