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

// 1. 桌面网格:hero + 筛选滚结果 + 无溢出
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const e = errs(p);
  await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.ex-card', { timeout: 20000 });
  await p.waitForTimeout(600);
  out.grid = await p.evaluate(() => ({
    hero: !!document.querySelector('.hero'),
    wallCards: document.querySelectorAll('.hero__wall-card').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    firstCardY: Math.round(document.querySelector('.ex-card').getBoundingClientRect().top),
  }));
  await p.click('.filter-row >> nth=0 >> .chip:has-text("胸部")');
  await p.waitForTimeout(700);
  out.grid.filter = await p.evaluate(() => ({
    scrollY: Math.round(window.scrollY),
    count: document.querySelector('.result-count').textContent,
  }));
  out.grid.errors = e;
  await p.close();
}

// 2. 移动端:抽屉 + hero 横滚 + 无溢出
{
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const e = errs(p);
  await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.ex-card', { timeout: 20000 });
  await p.waitForTimeout(600);
  out.mobile = await p.evaluate(() => {
    const wall = document.querySelector('.hero__wall');
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      wallScrollable: wall.scrollWidth > wall.clientWidth,
      toggleVisible: getComputedStyle(document.querySelector('.filter-toggle')).display !== 'none',
    };
  });
  await p.click('.filter-toggle');
  await p.waitForTimeout(400);
  out.mobile.drawerOpen = await p.$eval('.filters', el => getComputedStyle(el).transform !== 'none' || el.getBoundingClientRect().x < 200).catch(() => false);
  await p.click('.filters .filter-row >> nth=0 >> .chip:has-text("背部")');
  await p.click('.filters__done');
  await p.waitForTimeout(700);
  out.mobile.afterDone = await p.evaluate(() => ({
    scrollY: Math.round(window.scrollY),
    count: document.querySelector('.result-count').textContent,
  }));
  out.mobile.errors = e;
  await p.close();
}

// 3. 画廊模式
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const e = errs(p);
  await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.ex-card', { timeout: 20000 });
  await p.waitForTimeout(400);
  await p.click('.viewswitch-btn:has-text("画廊")');
  await p.waitForTimeout(700);
  out.gallery = await p.evaluate(() => ({
    heroGone: !document.querySelector('.hero'),
    gzone: !!document.querySelector('.g-zone-root'),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  out.gallery.errors = e;
  await p.close();
}

// 4. 详情:进入 → 返回恢复滚动位置(核心回归)
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const e = errs(p);
  await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.ex-card', { timeout: 20000 });
  await p.waitForTimeout(500);
  // 滚到第 10 张卡片并记录位置
  await p.evaluate(() => {
    const cards = document.querySelectorAll('.ex-card');
    cards[10].scrollIntoView({ block: 'center' });
  });
  await p.waitForTimeout(500);
  const beforeScroll = await p.evaluate(() => Math.round(window.scrollY));
  await p.click('.ex-card >> nth=10');
  await p.waitForTimeout(900);
  out.detail = await p.evaluate(() => ({
    url: location.pathname,
    title: document.querySelector('h1')?.textContent?.slice(0, 12),
    meta: document.querySelectorAll('.detail-meta dt').length,
  }));
  await p.click('.back-link');
  await p.waitForTimeout(900);
  out.detail.back = await p.evaluate((before) => ({
    scrollY: Math.round(window.scrollY),
    targetScroll: before,
    restored: Math.abs(Math.round(window.scrollY) - before) < 60,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }), beforeScroll);
  out.detail.errors = e;
  await p.close();
}

console.log(JSON.stringify(out, null, 2));
await browser.close();
