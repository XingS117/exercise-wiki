export interface GuideExercise {
  exerciseId: string
  prescription: string
  alternative: string
}

export interface TrainingGuide {
  slug: string
  title: string
  description: string
  answer: string
  audience: string
  frequency: string
  schedule: string[]
  exercises: GuideExercise[]
  safetyNotes: string[]
  sourceLabel: string
  updatedAt: string
}

export const guides: TrainingGuide[] = [
  {
    slug: 'beginner-chest-workout',
    title: '新手胸肌怎么练',
    description: '给健身新手的胸肌入门安排：每周 2 次，以俯卧撑和卧推为主，附动作替代与安全提示。',
    answer: '新手练胸先把每周 2 次、间隔至少 48 小时的推类训练做稳定，再从能保持动作质量的俯卧撑或卧推开始。',
    audience: '没有持续力量训练经验，且日常活动没有引发胸、肩、腕明显疼痛的人。',
    frequency: '每周 2 次，间隔至少 48 小时；每次训练前做 5 至 10 分钟轻度热身。',
    schedule: [
      '先做主要推举动作，再做较轻的飞鸟类动作；每组保留约 2 至 3 次余力。',
      '连续 2 周都能稳定完成目标次数后，再小幅增加次数或重量，不同时增加两者。',
      '其余训练日安排背部、下肢或休息，避免连续多天只练推类动作。',
    ],
    exercises: [
      { exerciseId: '0662', prescription: '3 组，每组 6 至 12 次', alternative: '无法完成地面俯卧撑时，改用墙壁俯卧撑并减少动作幅度。' },
      { exerciseId: '0025', prescription: '3 组，每组 6 至 10 次，先用空杆或可控重量', alternative: '没有杠铃或还不稳定时，改用哑铃卧推。' },
      { exerciseId: '0289', prescription: '2 至 3 组，每组 8 至 12 次', alternative: '肩部不舒服时，降低重量、缩小下放深度，或只保留俯卧撑。' },
      { exerciseId: '0308', prescription: '2 组，每组 10 至 15 次，使用轻重量', alternative: '控制不住肩部或手腕位置时，暂不安排飞鸟。' },
    ],
    safetyNotes: [
      '动作中出现胸痛、头晕、麻木或尖锐的肩部疼痛时，应停止训练并寻求合适的专业意见。',
      '不要为了完成次数而耸肩、弹震或让腰部明显拱起；动作质量下降就结束该组。',
    ],
    sourceLabel: '动作演示与基础动作信息来自站内动作资料库。',
    updatedAt: '2026-08-09',
  },
  {
    slug: 'home-bodyweight-full-body',
    title: '居家徒手全身训练怎么安排',
    description: '适合居家新手的徒手全身训练安排：每周 2 至 3 次，覆盖推、下肢和核心动作。',
    answer: '居家徒手全身训练可以每周做 2 至 3 次，每次选择推、下肢和核心各一个动作，动作之间留出恢复时间。',
    audience: '希望在家建立规律运动习惯，且能在无明显疼痛的情况下完成基础起立、下蹲和撑地动作的人。',
    frequency: '每周 2 至 3 次，非连续日进行；每次训练约 20 至 35 分钟。',
    schedule: [
      '按下肢、推、核心的顺序循环训练，动作间休息 60 至 90 秒。',
      '每个动作先做 2 组；适应后再增加到 3 组，不以气喘程度代替动作标准。',
      '如果当日睡眠不足、身体不适或关节疼痛，缩短训练或改为散步和轻柔活动。',
    ],
    exercises: [
      { exerciseId: '2368', prescription: '2 至 3 组，每侧 8 至 12 次', alternative: '膝盖不舒服时，减小下蹲深度并扶稳固定物。' },
      { exerciseId: '0662', prescription: '2 至 3 组，每组 5 至 12 次', alternative: '改用墙壁俯卧撑，逐步降低支撑高度。' },
      { exerciseId: '0274', prescription: '2 至 3 组，每组 8 至 15 次', alternative: '颈部紧张时，减少动作幅度并让下巴自然回收。' },
      { exerciseId: '0630', prescription: '2 组，每组 20 至 30 秒', alternative: '手腕不适时，可改为缓慢原地抬膝并降低速度。' },
    ],
    safetyNotes: [
      '跳跃、快速切换或高冲击动作不是必需项；新手可优先选择可控的慢速版本。',
      '若有正在治疗的疾病、近期手术或不明原因疼痛，请先咨询适合你的专业人士。',
    ],
    sourceLabel: '动作演示与基础动作信息来自站内动作资料库。',
    updatedAt: '2026-08-09',
  },
  {
    slug: 'beginner-dumbbell-full-body',
    title: '哑铃新手全身训练计划',
    description: '给拥有一对可调哑铃的新手的全身训练计划：每周 2 次，覆盖深蹲、推、拉和髋部动作。',
    answer: '哑铃新手全身训练可从每周 2 次开始，用能全程控制的轻重量完成深蹲、推、拉和髋部动作。',
    audience: '已有一对轻到中等重量哑铃，能保持基本站姿和握持稳定的新手。',
    frequency: '每周 2 次，间隔至少 48 小时；同一动作先保持重量不变，稳定后再进阶。',
    schedule: [
      '先做深蹲和髋部动作，再做上肢推、拉动作；每组之间休息 90 至 120 秒。',
      '选择完成最后 2 次仍能控制路径的重量；动作变形时减轻重量或减少次数。',
      '每周只增加一个变量，例如每组增加 1 至 2 次，或提高最小可调重量。',
    ],
    exercises: [
      { exerciseId: '0413', prescription: '3 组，每组 8 至 12 次', alternative: '站不稳时，降低重量并在镜子前练习均匀下蹲。' },
      { exerciseId: '0300', prescription: '3 组，每组 8 至 10 次', alternative: '腰背无法保持稳定时，减少下放深度并优先练习髋部后移。' },
      { exerciseId: '0289', prescription: '3 组，每组 8 至 12 次', alternative: '肩部不适时，采用中立握并减轻重量。' },
      { exerciseId: '3168', prescription: '2 至 3 组，每组 8 至 12 次', alternative: '没有可用支撑条件时，改做徒手划船变式或暂时删去该动作。' },
    ],
    safetyNotes: [
      '哑铃训练前检查锁扣和握把，训练区域保持无杂物，放下哑铃时不要砸向地面。',
      '如果出现放射痛、眩晕、持续性关节疼痛或呼吸异常，应停止训练并寻求合适的专业意见。',
    ],
    sourceLabel: '动作演示与基础动作信息来自站内动作资料库。',
    updatedAt: '2026-08-09',
  },
  {
    slug: 'male-fitness-exercises',
    title: '男性健身训练动作入门',
    description: '面向男性新手的基础健身动作入门：覆盖推、拉、下肢和肩部动作，先练动作质量，再逐步增加训练量。',
    answer: '男性新手可以从每周 2 次全身训练开始，选择能稳定控制的推、拉、下肢和肩部动作，不需要一开始追求大重量。',
    audience: '希望建立基础力量训练习惯，且没有明显胸、肩、腰、膝疼痛的人。',
    frequency: '每周 2 次，间隔至少 48 小时；每次训练前做 5 至 10 分钟轻度热身。',
    schedule: [
      '先安排下肢和大肌群动作，再做上肢推、拉与肩部动作；每组保留约 2 至 3 次余力。',
      '先固定动作路径和呼吸节奏，连续 2 周动作稳定后再增加次数或重量。',
      '训练日之间安排休息或轻度活动，不用同一天堆叠大量相似动作。',
    ],
    exercises: [
      { exerciseId: '0413', prescription: '3 组，每组 8 至 12 次', alternative: '站不稳时降低重量，先练习均匀下蹲。' },
      { exerciseId: '0025', prescription: '3 组，每组 6 至 10 次', alternative: '没有杠铃时改用可控重量的哑铃卧推。' },
      { exerciseId: '0027', prescription: '3 组，每组 8 至 12 次', alternative: '腰背无法稳定时减少重量并缩短动作幅度。' },
      { exerciseId: '0414', prescription: '2 至 3 组，每组 8 至 12 次', alternative: '肩部不适时采用轻重量并停止疼痛范围内的动作。' },
    ],
    safetyNotes: [
      '男性不是训练强度或重量的保证；动作质量和恢复情况比追求极限重量更重要。',
      '出现胸痛、眩晕、放射痛或持续性关节疼痛时停止训练并寻求合适的专业意见。',
    ],
    sourceLabel: '动作演示与基础动作信息来自站内动作资料库。',
    updatedAt: '2026-09-13',
  },
  {
    slug: 'core-abs-beginner',
    title: '核心与腹肌入门训练',
    description: '给新手的核心与腹肌入门安排：从卷腹、仰卧起坐和低冲击动作开始，逐步建立躯干控制。',
    answer: '核心与腹肌训练可以从每周 2 至 3 次开始，选择 2 至 4 个能控制呼吸和腰背位置的动作，不必每天训练腹部。',
    audience: '希望加强基础躯干控制，且日常活动没有引发明显腰背或颈部疼痛的人。',
    frequency: '每周 2 至 3 次，非连续日进行；每次约 10 至 20 分钟。',
    schedule: [
      '先做慢速屈曲类动作，再加入短时间的全身协调动作；每组之间休息 60 至 90 秒。',
      '保持下背部和颈部舒适，不用借力甩动完成次数；动作变形就结束该组。',
      '连续 2 周都能稳定完成后，只增加一个变量，例如每组增加 1 至 2 次。',
    ],
    exercises: [
      { exerciseId: '0274', prescription: '2 至 3 组，每组 8 至 15 次', alternative: '颈部紧张时减少幅度并让下巴自然回收。' },
      { exerciseId: '0001', prescription: '2 组，每组 8 至 12 次', alternative: '腰背不适时改做更小幅度的卷腹。' },
      { exerciseId: '0006', prescription: '2 组，每侧 8 至 12 次', alternative: '控制不住躯干时减少触碰距离。' },
      { exerciseId: '0630', prescription: '2 组，每组 20 至 30 秒', alternative: '手腕不适时改为缓慢原地抬膝。' },
    ],
    safetyNotes: [
      '腹肌训练不能替代整体活动和恢复；不以腰背疼痛换取更高次数。',
      '出现尖锐疼痛、麻木、头晕或呼吸异常时停止训练并寻求合适的专业意见。',
    ],
    sourceLabel: '动作演示与基础动作信息来自站内动作资料库。',
    updatedAt: '2026-09-13',
  },
  {
    slug: 'indoor-no-equipment-workout',
    title: '室内无器械健身动作示范',
    description: '适合室内新手的无器械动作安排：覆盖下肢、推、核心和低冲击心肺动作，按可控节奏完成。',
    answer: '室内无器械训练可以每周做 2 至 3 次，从下肢、推和核心各选一个动作，先用慢速版本建立稳定习惯。',
    audience: '希望在家训练，且能在无明显疼痛的情况下完成基础起立、下蹲和撑地动作的人。',
    frequency: '每周 2 至 3 次，非连续日进行；每次约 20 至 30 分钟。',
    schedule: [
      '按下肢、推、核心和低冲击心肺的顺序安排，每个动作之间休息 60 至 90 秒。',
      '先做 2 组，适应后再增加到 3 组；不以速度或气喘程度代替动作标准。',
      '地面湿滑或空间狭窄时删去跳跃动作，优先选择可控的站立或地面版本。',
    ],
    exercises: [
      { exerciseId: '2368', prescription: '2 至 3 组，每侧 8 至 12 次', alternative: '膝盖不舒服时减小下蹲深度并扶稳固定物。' },
      { exerciseId: '0662', prescription: '2 至 3 组，每组 5 至 12 次', alternative: '改用墙壁俯卧撑并逐步降低支撑高度。' },
      { exerciseId: '0274', prescription: '2 至 3 组，每组 8 至 15 次', alternative: '颈部紧张时减少动作幅度。' },
      { exerciseId: '0006', prescription: '2 组，每侧 8 至 12 次', alternative: '躯干摇晃时缩短触碰距离。' },
    ],
    safetyNotes: [
      '训练区域保持干燥、无杂物；无器械不代表需要快速或高冲击动作。',
      '若有正在治疗的疾病、近期手术或不明原因疼痛，请先咨询适合你的专业人士。',
    ],
    sourceLabel: '动作演示与基础动作信息来自站内动作资料库。',
    updatedAt: '2026-09-13',
  },
  {
    slug: 'fitness-exercise-guide',
    title: '健身锻炼操作指南',
    description: '从训练目标、动作选择、每周频率到安全边界，帮助健身新手建立可执行的基础锻炼路径。',
    answer: '开始健身时先确定目标和可用场景，每次选择推、拉、下肢或核心动作中的 2 至 4 个，用稳定频率替代一次性堆量。',
    audience: '刚开始建立运动习惯，且没有明显运动相关疼痛的人。',
    frequency: '每周 2 至 3 次，非连续日进行；每次约 20 至 40 分钟。',
    schedule: [
      '先选一个主要目标，再从站内动作库按身体部位、器械或肌群筛选动作。',
      '每个动作先做 2 至 3 组，保留余力；连续 2 周稳定后再增加次数或重量。',
      '训练后记录动作、组数和身体感受，出现异常信号时优先休息和寻求专业意见。',
    ],
    exercises: [
      { exerciseId: '0413', prescription: '3 组，每组 8 至 12 次', alternative: '先用徒手深蹲熟悉下肢路径。' },
      { exerciseId: '0662', prescription: '2 至 3 组，每组 5 至 12 次', alternative: '无法完成时改用墙壁俯卧撑。' },
      { exerciseId: '0274', prescription: '2 至 3 组，每组 8 至 15 次', alternative: '颈部紧张时减少幅度。' },
      { exerciseId: '0651', prescription: '2 至 3 组，每组 3 至 8 次或辅助完成', alternative: '无法完成引体向上时先选择更易控制的拉类动作。' },
    ],
    safetyNotes: [
      '动作库用于理解动作和基础安排，不替代医疗诊断、康复方案或个体化教练指导。',
      '出现胸痛、头晕、麻木、放射痛或持续性关节疼痛时停止训练。',
    ],
    sourceLabel: '动作演示与基础动作信息来自站内动作资料库。',
    updatedAt: '2026-09-13',
  },
  {
    slug: 'beginner-bodybuilding-exercises',
    title: '健美动作训练入门',
    description: '从胸、背、肩和腿的基础动作开始认识健美训练，先建立动作控制，再逐步安排训练量。',
    answer: '健美动作训练可以从每周 2 次开始，每次覆盖几个主要肌群，使用能控制全程的重量并保留恢复时间。',
    audience: '希望了解基础健美动作，且具备基本站立、推举和髋部控制能力的人。',
    frequency: '每周 2 次，间隔至少 48 小时；每次训练前做轻度热身。',
    schedule: [
      '先安排复合动作，再安排较轻的局部动作；不同训练日轮换胸、背、肩和腿的重点。',
      '每组保留约 2 至 3 次余力，动作路径变形时减轻重量或减少次数。',
      '每周只增加一个变量，避免同时增加重量、次数和训练天数。',
    ],
    exercises: [
      { exerciseId: '0025', prescription: '3 组，每组 6 至 10 次', alternative: '没有杠铃时改用哑铃卧推。' },
      { exerciseId: '0027', prescription: '3 组，每组 8 至 12 次', alternative: '腰背不稳时降低重量并控制下放。' },
      { exerciseId: '0414', prescription: '2 至 3 组，每组 8 至 12 次', alternative: '肩部不适时采用轻重量和中立握。' },
      { exerciseId: '0413', prescription: '3 组，每组 8 至 12 次', alternative: '站不稳时降低重量并缩小动作幅度。' },
    ],
    safetyNotes: [
      '健美训练不以疼痛或极限重量作为目标；动作质量下降就结束该组。',
      '出现尖锐疼痛、眩晕、麻木或异常呼吸时停止训练并寻求专业意见。',
    ],
    sourceLabel: '动作演示与基础动作信息来自站内动作资料库。',
    updatedAt: '2026-09-13',
  },
  {
    slug: 'exercise-english-names',
    title: '健身动作英文名称对照与示范',
    description: '对照常见健身动作的中文名与英文动作名（English exercise name），结合动画演示、步骤说明和器械信息查找动作。',
    answer: '查找英文健身动作时，可以先用中文名或 English exercise name 搜索，再进入动作详情核对动画、步骤、器械和目标肌群。',
    audience: '需要用英文动作名查资料，或希望核对中文动作翻译的健身用户。',
    frequency: '本页用于动作检索和名称对照；实际训练频率按对应训练专题和个人恢复情况安排。',
    schedule: [
      '先确认中文名和英文原名是否对应同一个动作，再查看动作演示和分步说明。',
      '通过器械、身体部位和目标肌群筛选相近动作，比较替代方案。',
      '遇到翻译不一致时以英文原名、动画和步骤交叉核对，不把名称相似当作动作完全相同。',
    ],
    exercises: [
      { exerciseId: '0662', prescription: '查看 push-up 的步骤和动作演示', alternative: '需要降低难度时选择墙壁俯卧撑变式。' },
      { exerciseId: '0025', prescription: '查看 barbell bench press 的步骤和器械信息', alternative: '没有杠铃时查看 dumbbell bench press。' },
      { exerciseId: '0413', prescription: '查看 dumbbell squat 的步骤和目标肌群', alternative: '重量无法控制时先练习徒手深蹲。' },
      { exerciseId: '0300', prescription: '查看 dumbbell deadlift 的步骤和髋部动作', alternative: '腰背无法稳定时降低重量和动作幅度。' },
    ],
    safetyNotes: [
      '英文名称用于检索和核对，不代表不同语言名称对应的动作一定完全相同。',
      '动作中出现疼痛、眩晕、麻木或呼吸异常时停止训练并寻求合适的专业意见。',
    ],
    sourceLabel: '英文动作名、中文译名和动作演示来自站内动作资料库。',
    updatedAt: '2026-09-13',
  },
]
