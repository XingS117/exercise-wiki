import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__line">
          <span>动作百科 · 1324 个健身动作的中文图解库</span>
          <span className="footer__sep">◆</span>
          <span>动画演示 © Gym visual — https://gymvisual.com/</span>
        </div>
        <div className="footer__line">
          <span>数据来自 <a href="https://github.com/hasaneyldrm/exercises-dataset" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>exercises-dataset</a></span>
          <span className="footer__sep">·</span>
          <span>动作名称翻译可能存在出入，以英文原名为准</span>
          <span className="footer__sep">·</span>
          <Link to="/editorial-policy">资料来源与编辑原则</Link>
        </div>
        <div className="footer__legal" aria-label="网站备案信息">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">ICP主体备案号：鲁ICP备2026026570号</a>
          <a href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=37070402000217" target="_blank" rel="noreferrer">公安备案号：鲁公网安备37070402000217号</a>
        </div>
      </div>
    </footer>
  )
}
