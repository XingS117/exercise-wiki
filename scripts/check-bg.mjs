import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.hero', { timeout: 20000 });
await p.waitForTimeout(1000);
const r = await p.evaluate(() => {
  const cs = getComputedStyle(document.querySelector('.hero'));
  return {
    bgHasPhoto: cs.backgroundImage.includes('hero-bg.jpg'),
    bgLayers: cs.backgroundImage.split('),').length,
    heroBgFirst40: cs.backgroundImage.slice(0, 60),
    titleColor: getComputedStyle(document.querySelector('.hero__title')).color,
    subColor: getComputedStyle(document.querySelector('.hero__sub')).color,
  };
});
console.log('hero bg:', JSON.stringify(r, null, 2));
await p.screenshot({ path: 'shots/hero-new.png' });
await browser.close();
