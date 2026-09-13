import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.ex-card', { timeout: 20000 });
await p.waitForTimeout(400);

const out = [];
// Tab 前几个可交互元素
for (let i = 0; i < 6; i++) {
  await p.keyboard.press('Tab');
  await p.waitForTimeout(80);
  out.push(await p.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName + (el.className ? '.' + String(el.className).split(' ').slice(0, 2).join('.') : ''),
      outline: cs.outlineStyle !== 'none' ? cs.outlineWidth + ' ' + cs.outlineStyle + ' ' + cs.outlineColor : 'NONE',
    };
  }));
}
console.log(JSON.stringify(out, null, 2));
await browser.close();
