# 动作百科 · 健身动作图解库

基于 [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) 的 **1324 个健身动作**数据集做的中文百科站。品牌 LOGO 使用「文星」VI(深蓝渐变徽章 + 白星 + 金"文",见 `public/logo.svg`)。

## 🌐 线上地址

| 站点 | 地址 | 说明 |
|---|---|---|
| **健身动作百科** | https://fitness.xingshuwen.com | 主站(HTTPS,Let's Encrypt 自动续期) |
| **访问监控看板** | https://analytics.xingshuwen.com/dashboard.html | GoAccess 中文看板(每日 00:05 自动更新) |

部署目标为现有 HTTPS 站点。服务器、DNS 和凭据不保存在本仓库。

## 功能

- **1324 个动作全量浏览** — 卡片网格,悬停卡片即播放动画 GIF;**虚拟列表**只渲染视口附近的行(桌面 1324→~55 张 DOM,移动端→~22 张),滚动丝滑、首屏秒开
- **两种浏览模式**(右上角切换,记忆在 localStorage):
  - **网格**(默认):Hum 彩色主题卡片,搜索 + 三维筛选(部位 10 × 器械 28 × 肌群 19)
  - **画廊**:黑白极简照片墙 + **部位门户分区**(10 大部位 + 全部),hover 黑白图变彩色动画,全屏灯箱(键盘 ←/→ 切换、相邻 GIF 预加载)
- **显式搜索** — 输入后按回车 / 点「搜索」按钮才提交,关键词回显,Esc 取消草稿
- **移动端** — 筛选收进右侧抽屉(自动隐藏),品牌文字不换行,320/375/414/768 全适配无横向溢出
- **详情页** — GIF 动画大图 + 中文分步说明 + 完整元数据 + 同肌群相关动作(6 个)
- **专题入口** — 按身体部位、器械和目标肌群生成可分享的动作专题页
- **训练清单** — 详情页一键加入本地训练清单,无需登录,刷新后仍保留
- **中文名称** — 全量翻译为中文健身术语(术语词典 + 组合规则生成)

## 技术栈

Vite + React 18 + TypeScript + react-router(BrowserRouter + 静态预渲染,保留旧 Hash 链接兼容)

设计遵循 Hallmark 技能:**genre playful · theme Hum**(奶油纸面 + pear/cyan/coral 多强调色),全部样式走 OKLCH token(`src/styles/tokens.css`)。字体 **Plus Jakarta Sans 自托管**(`public/fonts/`,不依赖被墙的 Google Fonts)。

## 目录

```
src/
├── data/exercises.json    # 裁剪后数据(1.3MB,仅中英)
├── lib/                   # collections / seo / trainingList / types / zh / useViewMode
├── components/            # Nav / Footer / ExerciseCard / CollectionLinks / TrainingListPanel
├── pages/                 # HomePage / CollectionPage / ExercisePage
└── styles/                # tokens.css / global.css / page.css / gallery.css
public/
├── images/  videos/       # 1324 jpg + 1324 gif(数据路径即 images/videos 前缀)
├── fonts/                 # Plus Jakarta Sans woff2(自托管)
└── logo.svg  favicon.svg  # 文星品牌素材
```

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产出 dist/(JS/CSS 带 hash + 详情/专题预渲染页,直接覆盖部署安全)
```

## 重新部署

```bash
npm run build
```

## 监控

GoAccess 解析站点访问日志并生成监控报告；监控数据不随站点代码公开。

## 数据说明

- 媒体(GIF/缩略图)© Gym visual,已保留署名;商用需另行授权
- 动作中文名为脚本翻译(术语词典 + 组合规则),个别动作存在翻译出入,详情页保留英文原名对照
- 中文名称由术语词典和组合规则生成；详情页同时保留英文原名对照。
