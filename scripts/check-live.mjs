import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const out = {};
const errs = (p) => {
  const list = [];
  p.on('pageerror', e => list.push('PAGEERR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') list.push('CONSOLE: ' + m.text()); });
  return list;
};

// 线上桌面
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const e = errs(p);
  await p.goto('https://fitness.xingshuwen.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForSelector('.ex-card', { timeout: 25000 });
  await p.waitForTimeout(1200);
  out.live = await p.evaluate(() => {
    const hero = document.querySelector('.hero');
    const cs = getComputedStyle(hero);
    const wall = document.querySelector('.hero__wall');
    return {
      heroBgHasPhoto: cs.backgroundImage.includes('hero-bg'),
      wallCards: document.querySelectorAll('.hero__wall-card').length,
      wallScrollable: wall ? wall.scrollWidth > wall.clientWidth : null,
      firstCardY: Math.round(document.querySelector('.ex-card').getBoundingClientRect().top),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      titleColor: getComputedStyle(document.querySelector('.hero__title')).color,
      imgFilter: getComputedStyle(document.querySelector('.hero__wall-img')).filter,
    };
  });
  // hover 变彩
  await p.hover('.hero__wall-card >> nth=0');
  await p.waitForTimeout(700);
  out.live.hoverGifOpacity = await p.$eval('.hero__wall-card >> nth=0 >> .hero__wall-gif', el => getComputedStyle(el).opacity);
  out.live.errors = e;
  await p.close();
}

// 线上移动端
{
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const e = errs(p);
  await p.goto('https://fitness.xingshuwen.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForSelector('.ex-card', { timeout: 25000 });
  await p.waitForTimeout(1200);
  out.liveMobile = await p.evaluate(() => {
    const wall = document.querySelector('.hero__wall');
    return {
      wallScrollable: wall.scrollWidth > wall.clientWidth,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      toggleVisible: getComputedStyle(document.querySelector('.filter-toggle')).display !== 'none',
    };
  });
  out.liveMobile.errors = e;
  await p.close();
}

// 线上详情 + 返回恢复
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const e = errs(p);
  await p.goto('https://fitness.xingshuwen.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForSelector('.ex-card', { timeout: 25000 });
  await p.waitForTimeout(800);
  await p.evaluate(() => { document.querySelectorAll('.ex-card')[8].scrollIntoView({ block: 'center' }); });
  await p.waitForTimeout(500);
  const before = await p.evaluate(() => Math.round(window.scrollY));
  await p.click('.ex-card >> nth=8');
  await p.waitForTimeout(1200);
  out.liveDetail = await p.evaluate(() => ({
    title: document.querySelector('h1')?.textContent?.slice(0, 12),
    backLink: !!document.querySelector('.back-link'),
  }));
  await p.click('.back-link');
  await p.waitForTimeout(1200);
  out.liveDetail.back = await p.evaluate((b) => ({
    scrollY: Math.round(window.scrollY),
    target: b,
    restored: Math.abs(Math.round(window.scrollY) - b) < 60,
  }), before);
  out.liveDetail.errors = e;
  await p.close();
}

console.log(JSON.stringify(out, null, 2));
await browser.close();
