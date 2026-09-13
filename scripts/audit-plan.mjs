import { chromium } from 'playwright';

const EXE = 'C:\\Users\\shuwe\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const browser = await chromium.launch({ executablePath: EXE });

async function measure(w, label) {
  const p = await browser.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('https://fitness.xingshuwen.com/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.hero__title', { timeout: 20000 });
  await p.waitForTimeout(600);

  const m = await p.evaluate(() => {
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: Math.round(b.left), w: Math.round(b.width), y: Math.round(b.top), h: Math.round(b.height), right: Math.round(b.right) };
    };
    const container = document.querySelector('.container');
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero__title');
    const heroSub = document.querySelector('.hero__sub');
    const search = document.querySelector('.search-wrap');
    const stats = document.querySelector('.hero__stats');
    const filters = document.querySelector('.filters');
    const resultBar = document.querySelector('.result-bar');
    const cardGrid = document.querySelector('.card-grid');
    const vw = window.innerWidth;

    return {
      vw,
      container: r(container),
      hero: r(hero),
      heroTitle: r(heroTitle),
      heroSub: r(heroSub),
      search: r(search),
      stats: r(stats),
      filters: r(filters),
      resultBar: r(resultBar),
      cardGridTop: cardGrid ? Math.round(cardGrid.getBoundingClientRect().top) : null,
      // hero 右侧空白(container 右边界 - hero 右边界)
      heroRightGap: container && hero ? Math.round(container.getBoundingClientRect().right - hero.getBoundingClientRect().right) : null,
      // hero 下方到结果的空白
      heroBottomToResult: hero && resultBar ? Math.round(resultBar.getBoundingClientRect().top - hero.getBoundingClientRect().bottom) : null,
      // 背景与文字色
      bodyBg: getComputedStyle(document.body).backgroundColor,
      bodyColor: getComputedStyle(document.body).color,
      titleColor: getComputedStyle(heroTitle).color,
      accent3: getComputedStyle(heroTitle.querySelector('b') || heroTitle).color,
      // 首屏是否有背景装饰元素(图片/渐变/图形)
      heroBgImages: [...document.querySelectorAll('.hero *')].filter(el => {
        const s = getComputedStyle(el);
        return s.backgroundImage !== 'none' || el.tagName === 'IMG' || el.tagName === 'CANVAS' || el.tagName === 'SVG';
      }).map(el => el.tagName + '.' + el.className).slice(0, 8),
      // 首屏第一个卡片位置
      firstCardY: (() => { const c = document.querySelector('.ex-card'); return c ? Math.round(c.getBoundingClientRect().top) : null; })(),
      // 字体
      bodyFont: getComputedStyle(document.body).fontFamily.slice(0, 60),
    };
  });
  console.log(`=== ${label} (${w}px) ===`);
  console.log(JSON.stringify(m, null, 2));
  await p.close();
}

await measure(1280, 'desktop-1280');
await measure(1920, 'desktop-1920');
await measure(390, 'mobile-390');
await browser.close();
