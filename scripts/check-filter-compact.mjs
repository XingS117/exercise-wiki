import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.ex-card', { timeout: 20000 });
await p.waitForTimeout(600);

const r = await p.evaluate(() => {
  const filters = document.querySelector('.filters');
  const resultBar = document.querySelector('.result-bar');
  const firstCard = document.querySelector('.ex-card');
  const chips = document.querySelector('.filter-row__chips');
  const rTop = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);
  return {
    filtersH: Math.round(filters.getBoundingClientRect().height),
    resultBarTop: rTop(resultBar),
    firstCardTop: firstCard ? rTop(firstCard) : null,
    chipsWrap: getComputedStyle(chips).flexWrap,
    chipsOverflow: getComputedStyle(chips).overflowX,
    chipsScrollable: chips.scrollWidth > chips.clientWidth,
    firstScreenCards: [...document.querySelectorAll('.ex-card')].filter(c => {
      const b = c.getBoundingClientRect();
      return b.top >= 0 && b.top < window.innerHeight;
    }).length,
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
