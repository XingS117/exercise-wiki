import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.hero__wall-card', { timeout: 20000 });
await p.waitForTimeout(1300);
const r = await p.evaluate(() => {
  const hero = document.querySelector('.hero').getBoundingClientRect();
  const wall = document.querySelector('.hero__wall');
  const wallRect = wall.getBoundingClientRect();
  const card = document.querySelector('.hero__wall-card').getBoundingClientRect();
  const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  return {
    heroBottom: Math.round(hero.bottom),
    wallDisplay: getComputedStyle(wall).display,
    wallScrollable: wall.scrollWidth > wall.clientWidth,
    wallScrollW: wall.scrollWidth,
    wallClientW: wall.clientWidth,
    cardW: Math.round(card.width),
    cardTransform: getComputedStyle(document.querySelector('.hero__wall-card')).transform,
    horizontalOverflow: overflow,
    firstCardY: (() => { const c = document.querySelector('.ex-card'); return c ? Math.round(c.getBoundingClientRect().top) : null; })(),
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
