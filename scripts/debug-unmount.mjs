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
// 点击前监听所有滚动(污染前)
const scrollEvents = [];
await p.evaluate(() => {
  window.__scrollEvents = [];
  window.addEventListener('scroll', () => window.__scrollEvents.push(Math.round(window.scrollY)), { passive: true });
});
await p.click('.ex-card >> nth=10');
await p.waitForTimeout(400);
const log = await p.evaluate(() => ({
  unmount: window.__unmountLog,
  path: location.pathname,
  scrollEvents: window.__scrollEvents.slice(0, 10),
}));
console.log(JSON.stringify(log, null, 2));
await browser.close();
