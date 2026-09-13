import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });
const out = {};

// 正常模式:动画存在
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.hero__title', { timeout: 20000 });
  // 立即检查(动画刚开始,opacity 应 < 1)
  const early = await p.evaluate(() => ({
    titleOpacity: getComputedStyle(document.querySelector('.hero__title')).opacity,
    titleAnim: getComputedStyle(document.querySelector('.hero__title')).animationName,
    cardAnim: getComputedStyle(document.querySelector('.hero__wall-card')).animationName,
    cardDelay: getComputedStyle(document.querySelector('.hero__wall-card')).animationDelay,
  }));
  out.normal = early;
  // 等动画结束,opacity 应为 1
  await p.waitForTimeout(1300);
  out.normalEnd = await p.evaluate(() => ({
    titleOpacity: getComputedStyle(document.querySelector('.hero__title')).opacity,
    wallOpacity: getComputedStyle(document.querySelector('.hero__wall-card')).opacity,
    wallTransform: getComputedStyle(document.querySelector('.hero__wall-card')).transform,
  }));
  await p.close();
}

// reduced-motion:动画禁用
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await p.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.hero__title', { timeout: 20000 });
  out.reduced = await p.evaluate(() => ({
    titleAnim: getComputedStyle(document.querySelector('.hero__title')).animationName,
    cardAnim: getComputedStyle(document.querySelector('.hero__wall-card')).animationName,
    titleOpacity: getComputedStyle(document.querySelector('.hero__title')).opacity,
  }));
  await p.close();
}

console.log(JSON.stringify(out, null, 2));
await browser.close();
