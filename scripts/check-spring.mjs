import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.ex-card', { timeout: 20000 });
await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const tf = (sel, prop = 'transitionTimingFunction') => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el)[prop].split(',')[0] : null;
  };
  return {
    btn: tf('.btn, .search-submit'),
    card: tf('.ex-card'),
    wallCard: tf('.hero__wall-card'),
    submit: tf('.search-submit'),
    springToken: getComputedStyle(document.documentElement).getPropertyValue('--ease-spring').trim(),
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
