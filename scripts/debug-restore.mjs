import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.ex-card', { timeout: 20000 });
await p.waitForTimeout(500);
await p.evaluate(() => {
  const cards = document.querySelectorAll('.ex-card');
  cards[10].scrollIntoView({ block: 'center' });
});
await p.waitForTimeout(500);
const before = await p.evaluate(() => Math.round(window.scrollY));
await p.click('.ex-card >> nth=10');
await p.waitForTimeout(900);
// 详情页:记录进入时保存值(通过 cleanup 后读模块?不可行)——直接返回
await p.click('.back-link');
await p.waitForTimeout(1200);
const after = await p.evaluate(() => ({
  scrollY: Math.round(window.scrollY),
  restoreLog: window.__restoreLog || null,
}));
console.log(JSON.stringify({ before, after }, null, 2));
await browser.close();
