import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
p.on('pageerror', e => errs.push(e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
await p.goto('http://127.0.0.1:5173/exercise/0025', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1200);
const r = await p.evaluate(() => ({
  url: location.pathname,
  bodyText: document.body.innerText.slice(0, 300),
  h1s: [...document.querySelectorAll('h1')].map(h => h.textContent),
  classes: [...document.querySelectorAll('#root > *')].map(e => e.className).slice(0, 5),
}));
console.log(JSON.stringify({ r, errs }, null, 2));
await browser.close();
