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

// 拦截 listState 保存:patch window 前先读
const saved = [];
await p.evaluate(() => {
  const w = window;
  const origScrollTo = w.scrollTo.bind(w);
  // 记录所有 scrollTo 调用
  w.__scrollLog = [];
  w.scrollTo = (...a) => { w.__scrollLog.push(a.join(',')); return origScrollTo(...a); };
});
await p.click('.ex-card >> nth=10');
await p.waitForTimeout(150);
const duringNav = await p.evaluate(() => ({
  scrollY: Math.round(window.scrollY),
  path: location.pathname,
  scrollLog: window.__scrollLog || [],
}));
await p.waitForTimeout(800);
const afterDetail = await p.evaluate(() => ({
  path: location.pathname,
  scrollY: Math.round(window.scrollY),
}));
console.log(JSON.stringify({ before, duringNav, afterDetail }, null, 2));
await browser.close();
