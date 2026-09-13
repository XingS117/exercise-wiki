import { Link } from 'react-router-dom'

export default function EditorialPolicyPage() {
  return (
    <div className="container page-policy">
      <article className="policy-content">
        <p className="mono-label">EDITORIAL POLICY</p>
        <h1>资料来源与编辑原则</h1>
        <p>动作百科帮助用户查找训练动作、查看中文图解和理解基础安排。我们尽量让页面内容可追溯、可核对，并清楚说明它的边界。</p>
        <section>
          <h2>动作资料来源</h2>
          <p>动作的英文名称、分类、器械、目标肌群和演示资料来自 <a href="https://github.com/hasaneyldrm/exercises-dataset" target="_blank" rel="noreferrer">exercises-dataset</a>；动画演示版权归 Gym Visual 所有。站内提供中文名称和说明，方便检索与理解。</p>
        </section>
        <section>
          <h2>翻译与更新</h2>
          <p>中文翻译可能和常见健身用语存在差异，涉及动作识别时应以英文原名、演示和具体步骤交叉核对。页面的“更新于”表示本站对专题内容的最近复核日期，不代表医学审查或个人训练效果保证。</p>
        </section>
        <section>
          <h2>训练建议边界</h2>
          <p>训练专题是面向一般人群的保守入门信息，不构成医疗建议、康复方案或个体化教练指导。正在治疗疾病、近期受伤或训练时出现持续疼痛、眩晕、呼吸异常的人，应停止训练并寻求适合自己的专业意见。</p>
        </section>
        <section>
          <h2>内容维护</h2>
          <p>专题只在能链接到现有动作资料、能明确写出适用边界和安全提示时发布。发现动作翻译、链接或描述问题，可通过网站所属域名的公开联系渠道反馈。</p>
        </section>
        <Link className="guide-back" to="/">返回动作百科</Link>
      </article>
    </div>
  )
}
