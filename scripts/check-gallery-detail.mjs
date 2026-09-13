import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const out = {};

// 画廊模式:切到画廊,hero 应消失
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.ex-card', { timeout: 20000 });
  await p.waitForTimeout(400);
  await p.click('.viewswitch-btn:has-text("画廊")');
  await p.waitForTimeout(700);
  out.gallery = await p.evaluate(() => ({
    heroPresent: !!document.querySelector('.hero'),
    gzone: !!document.querySelector('.g-zone-root'),
    brand: getComputedStyle(document.querySelector('.g-zone-root')).display,
  }));
  await p.close();
}

// 详情页
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('http://127.0.0.1:5173/exercise/0025', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(800);
  out.detail = await p.evaluate(() => ({
    title: document.querySelector('h1')?.textContent?.slice(0, 20) || null,
    backLink: !!document.querySelector('.back-link'),
    img: !!document.querySelector('.detail-card img, .detail-hero img'),
    meta: document.querySelectorAll('.detail-meta dt').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  await p.close();
}

console.log(JSON.stringify(out, null, 2));
await browser.close();
