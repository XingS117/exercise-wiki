import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.ex-card', { timeout: 20000 });
await p.waitForTimeout(500);

const out = await p.evaluate(() => {
  // 器械 chips 是否可横滚(第二个 filter-row)
  const rows = document.querySelectorAll('.filter-row');
  const equipChips = rows[1]?.querySelector('.filter-row__chips');
  return {
    equipScrollable: equipChips ? equipChips.scrollWidth > equipChips.clientWidth : null,
    equipScrollW: equipChips ? equipChips.scrollWidth : null,
    rows: rows.length,
  };
});

// 筛选后滚到结果(回归)
await p.click('.filter-row >> nth=0 >> .chip:has-text("胸部")');
await p.waitForTimeout(600);
out.filterScroll = await p.evaluate(() => ({
  scrollY: Math.round(window.scrollY),
  resultBarY: Math.round(document.querySelector('.result-bar').getBoundingClientRect().top),
  visibleCards: [...document.querySelectorAll('.ex-card')].filter(c => { const r = c.getBoundingClientRect(); return r.top >= 0 && r.top < window.innerHeight; }).length,
}));
console.log(JSON.stringify(out, null, 2));
await browser.close();
