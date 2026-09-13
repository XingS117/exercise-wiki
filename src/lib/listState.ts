// 列表浏览状态(模块级,刷新 JS 重载即清空)
// 用途:从列表进入详情时暂存,返回列表时完整恢复(滚动位置 + 搜索 + 筛选)
// 用模块变量而非 sessionStorage:StrictMode 双挂载安全、无竞态、刷新即复位
export interface ListState {
  qDraft: string
  q: string
  category: string | null
  equipments: string[]
  targets: string[]
  scroll: number
}

export const listState: ListState = {
  qDraft: '',
  q: '',
  category: null,
  equipments: [],
  targets: [],
  scroll: 0,
}
