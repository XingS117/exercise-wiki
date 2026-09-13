import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.hero__title', { timeout: 20000 });
await p.waitForTimeout(600);
const r = await p.evaluate(() => {
  const cs = (sel, prop) => getComputedStyle(document.querySelector(sel))[prop];
  return {
    titleColor: cs('.hero__title', 'color'),
    titleWeight: cs('.hero__title', 'fontWeight'),
    subColor: cs('.hero__sub', 'color'),
    inputBg: cs('.hero .search-input', 'backgroundColor'),
    inputColor: cs('.hero .search-input', 'color'),
    inputFocus: (() => { const el = document.querySelector('.hero .search-input'); el.focus(); return getComputedStyle(el).borderColor; })(),
    submitBg: cs('.hero .search-submit', 'backgroundColor'),
    submitColor: cs('.hero .search-submit', 'color'),
    statsBColor: cs('.hero__stats b', 'color'),
    statsBSize: cs('.hero__stats b', 'fontSize'),
    statsLabelColor: cs('.hero__stats-label', 'color'),
    monoColor: cs('.hero .mono-label', 'color'),
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
