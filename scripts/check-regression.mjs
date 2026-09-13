import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const out = {};

// 移动端抽屉:打开→选部位→完成→滚到结果
{
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await m.waitForSelector('.ex-card', { timeout: 20000 });
  await m.waitForTimeout(400);
  await m.click('.filter-toggle');
  await m.waitForTimeout(400);
  const drawerOpen = await m.evaluate(() => document.querySelector('.filters').getBoundingClientRect().x < 100);
  await m.click('.filters .filter-row >> nth=0 >> .chip:has-text("胸部")');
  await m.waitForTimeout(200);
  const badge = await m.$eval('.filter-toggle__count', el => el.textContent).catch(() => null);
  await m.click('.filters__done');
  await m.waitForTimeout(800);
  out.mobile = await m.evaluate((open) => ({
    drawerOpen: open,
    scrollY: Math.round(window.scrollY),
    resultBarY: Math.round(document.querySelector('.result-bar').getBoundingClientRect().top),
    visibleCards: [...document.querySelectorAll('.ex-card')].filter(c => { const r = c.getBoundingClientRect(); return r.top >= 0 && r.top < window.innerHeight; }).length,
  }), drawerOpen);
  await m.close();
}

// 显式搜索:输入→回车→滚到结果+回显
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.ex-card', { timeout: 20000 });
  await p.fill('.search-input', '深蹲');
  await p.press('.search-input', 'Enter');
  await p.waitForTimeout(700);
  out.search = await p.evaluate(() => ({
    count: document.querySelector('.result-count').textContent,
    echo: document.querySelector('.result-echo')?.textContent || null,
    scrollY: Math.round(window.scrollY),
    resultBarY: Math.round(document.querySelector('.result-bar').getBoundingClientRect().top),
  }));
  await p.close();
}

// 桌面 chips 横滚后点击仍生效
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.ex-card', { timeout: 20000 });
  await p.waitForTimeout(400);
  // 第二个 filter-row(器械)滚到末尾点一个 chip
  await p.evaluate(() => {
    const chips = document.querySelectorAll('.filter-row')[1].querySelector('.filter-row__chips');
    chips.scrollLeft = chips.scrollWidth;
  });
  await p.waitForTimeout(300);
  await p.click('.filter-row >> nth=1 >> .chip >> nth=-1');
  await p.waitForTimeout(600);
  out.desktopChip = await p.evaluate(() => ({
    badge: document.querySelector('.filter-toggle__count')?.textContent || null,
    count: document.querySelector('.result-count').textContent,
  }));
  await p.close();
}

console.log(JSON.stringify(out, null, 2));
await browser.close();
