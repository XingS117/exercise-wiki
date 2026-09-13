# Fitness 搜索平台接入与基线记录

## 固定资产

| 项目 | 地址 |
| --- | --- |
| 网站 | `https://fitness.xingshuwen.com/` |
| Sitemap | `https://fitness.xingshuwen.com/sitemap.xml` |
| Robots | `https://fitness.xingshuwen.com/robots.txt` |
| 首页抽检 | `https://fitness.xingshuwen.com/` |
| 动作页抽检 | `https://fitness.xingshuwen.com/exercise/0025` |
| 分类页抽检 | `https://fitness.xingshuwen.com/browse/body-part/chest` |
| 专题页抽检 | `https://fitness.xingshuwen.com/guides/beginner-chest-workout` |

## Google Search Console

1. 打开 [Google Search Console](https://search.google.com/search-console/)，添加 `xingshuwen.com` 为“网域”资产。
2. 将平台给出的 DNS TXT 记录添加到域名解析，等待验证通过。网域资产能覆盖 `fitness` 子域名，优先于只验证 URL 前缀。
3. 在“站点地图”提交 `https://fitness.xingshuwen.com/sitemap.xml`。
4. 用“网址检查”依次检查首页、动作页、分类页和专题页，记录：是否可被编入索引、Google 选择的规范网址、最近抓取时间和任何排除原因。
5. 对尚未收录且页面无错误的 URL 使用“请求编入索引”。不要对同一 URL 反复提交。

## Bing Webmaster Tools

1. 打开 [Bing Webmaster Tools](https://www.bing.com/webmasters/)，添加 `https://fitness.xingshuwen.com/`；可从 Google Search Console 导入验证，也可单独走 DNS 验证。
2. 提交同一 sitemap 地址。
3. 在“URL 检查”和“站点浏览器”中检查首页、动作页和专题页的抓取与规范网址。
4. 可选：只为 `fitness.xingshuwen.com` 创建 IndexNow key 文件，并在发布新增专题时提交变更 URL。IndexNow 只用于加速支持该协议的搜索引擎发现，不替代 Google 或百度的收录流程。

## 百度搜索资源平台

1. 打开 [百度搜索资源平台](https://ziyuan.baidu.com/)，添加 `https://fitness.xingshuwen.com/`。
2. 优先使用 DNS 验证；若只能使用文件验证，按平台要求把验证文件放到该子域名的站点根目录。
3. 在 sitemap 提交入口提交 `https://fitness.xingshuwen.com/sitemap.xml`。如平台提示单文件限制，再按平台规则拆分 sitemap，保留总 sitemap 不删除。
4. 检查首页、动作页和至少一个专题页的抓取、索引和异常报告；保存平台给出的排除原因和日期。

## 零基线与复盘

完成验证当天，在三个平台分别记录以下数值，并保存截图或导出文件：

| 日期 | 平台 | 已发现 URL | 已收录 URL | 近 28 天展示 | 点击 | 平均排名 | 前 20 查询词 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | Google |  |  |  |  |  |  |  |
|  | Bing |  |  |  |  |  |  |  |
|  | 百度 |  |  |  |  |  |  |  |

四周后先复查抓取、规范网址、收录和展示；十二周后再比较点击、专题落地页与专题到动作详情页的站内访问。只有已经获得真实展示或有明确用户需求、且能连接到现有动作资料的查询簇，才扩展 3 至 5 篇同类专题。

## 核查边界

提交 sitemap 和请求收录不保证排名或立即收录。是否被搜索引擎发现、选择哪个 canonical、何时参与排序，应以各平台的实际报告为准；第一方访问统计不能替代搜索查询数据。
