import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.hero__wall', { timeout: 20000 });
await p.waitForTimeout(500);
const r = await p.evaluate(() => {
  const wall = document.querySelector('.hero__wall');
  const cs = getComputedStyle(wall);
  return {
    display: cs.display,
    gridCols: cs.gridTemplateColumns,
    overflowX: cs.overflowX,
    flexDir: cs.flexDirection,
    scrollW: wall.scrollWidth,
    clientW: wall.clientWidth,
    vw: window.innerWidth,
    mediaMatched: window.matchMedia('(max-width: 640px)').matches,
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
