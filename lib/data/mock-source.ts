import { TrainingRecord, TrainingPlan, DietRecord, WeeklySummary, CoachResponse } from '@/types';

// Mock 训练记录
export const mockTrainingRecords: TrainingRecord[] = [
  {
    plan_id: '2026-05-22_背部',
    date: '2026-05-22',
    part: '背部',
    status_before: '状态一般，昨晚睡了6小时',
    rpe: 7,
    rating: 'good',
    notes: '整体完成度不错，划船重量稳定，高位下拉最后两组有点吃力',
    results: [
      { name: '坐姿划船', planned: '4组x10次x50kg', actual: '4组x10次x50kg', completed: true },
      { name: '高位下拉', planned: '4组x12次x45kg', actual: '4组x10-12次x45kg', completed: true, note: '最后两组只能做10个' },
      { name: '单臂哑铃划船', planned: '3组x12次x20kg', actual: '3组x12次x20kg', completed: true, note: '左侧先做，右侧跟12个' },
      { name: '面拉', planned: '3组x15次x15kg', actual: '跳过', completed: false, note: '昨天练肩已做过' },
    ],
    adjustments: [
      { action: 'remove', from: '面拉', reason: '昨天练肩已做过，避免过度训练' },
    ],
  },
  {
    plan_id: '2026-05-20_肩部',
    date: '2026-05-20',
    part: '肩部',
    status_before: '状态好，喝了肌酸',
    rpe: 8,
    rating: 'great',
    notes: '肌酸效果明显，推举重量突破，侧平举控制不错',
    results: [
      { name: '哑铃推举', planned: '4组x8次x22.5kg', actual: '4组x8次x25kg', completed: true, note: '重量突破' },
      { name: '侧平举', planned: '4组x12次x10kg', actual: '4组x12次x10kg', completed: true },
      { name: '面拉', planned: '3组x15次x15kg', actual: '3组x15次x15kg', completed: true },
      { name: '前平举', planned: '3组x12次x8kg', actual: '3组x12次x8kg', completed: true },
    ],
    adjustments: [],
  },
  {
    plan_id: '2026-05-18_腿部',
    date: '2026-05-18',
    part: '腿部',
    status_before: '状态好，充分休息',
    rpe: 9,
    rating: 'great',
    notes: '深蹲重量稳定，腿举冲击大重量，整体强度高',
    results: [
      { name: '深蹲', planned: '5组x5次x100kg', actual: '5组x5次x100kg', completed: true },
      { name: '腿举', planned: '4组x10次x200kg', actual: '4组x10次x220kg', completed: true, note: '冲击大重量' },
      { name: '罗马尼亚硬拉', planned: '4组x10次x80kg', actual: '4组x10次x80kg', completed: true },
      { name: '腿弯举', planned: '3组x12次x40kg', actual: '3组x12次x40kg', completed: true },
    ],
    adjustments: [],
  },
  {
    plan_id: '2026-05-16_胸部',
    date: '2026-05-16',
    part: '胸部',
    status_before: '状态一般，有点疲劳',
    rpe: 6,
    rating: 'okay',
    notes: '卧推重量没达到预期，飞鸟控制一般，整体强度不够',
    results: [
      { name: '平板卧推', planned: '4组x8次x80kg', actual: '4组x6次x80kg', completed: false, note: '只能做6个' },
      { name: '上斜哑铃卧推', planned: '4组x10次x25kg', actual: '4组x10次x25kg', completed: true },
      { name: '蝴蝶机夹胸', planned: '3组x12次x50kg', actual: '3组x12次x50kg', completed: true },
      { name: '绳索飞鸟', planned: '3组x15次x15kg', actual: '3组x12次x15kg', completed: false, note: '控制一般' },
    ],
    adjustments: [
      { action: 'modify', from: '平板卧推', to: '减重到75kg', reason: '状态不佳，降低重量保证动作质量' },
    ],
  },
  {
    plan_id: '2026-05-14_手臂',
    date: '2026-05-14',
    part: '手臂',
    status_before: '状态好',
    rpe: 7,
    rating: 'good',
    notes: '二头三头均衡训练，臂围有增长',
    results: [
      { name: '杠铃弯举', planned: '4组x10次x30kg', actual: '4组x10次x30kg', completed: true },
      { name: '锤式弯举', planned: '3组x12次x15kg', actual: '3组x12次x15kg', completed: true, note: '左侧先做' },
      { name: '绳索下压', planned: '4组x12次x30kg', actual: '4组x12次x30kg', completed: true },
      { name: '仰卧臂屈伸', planned: '3组x10次x20kg', actual: '3组x10次x20kg', completed: true },
    ],
    adjustments: [],
  },
];

// Mock 训练计划
export const mockTrainingPlans: TrainingPlan[] = [
  {
    plan_id: '2026-05-24_背部',
    title: '背部训练',
    date: '2026-05-24',
    status: '待执行',
    duration: 60,
    warmup: [
      { name: '肩袖热身', sets: 2, reps: '15' },
      { name: '弹力带拉伸', sets: 2, reps: '12' },
    ],
    main: [
      { name: '坐姿划船', sets: 4, reps: '10', weight: '50kg', rest: '90s' },
      { name: '高位下拉', sets: 4, reps: '10-12', weight: '45kg', rest: '90s' },
      { name: '单臂哑铃划船', sets: 3, reps: '12', weight: '20kg', rest: '60s' },
    ],
    finisher: [
      { name: '直臂下压', sets: 3, reps: '15', weight: '15kg', posture: true },
      { name: '面拉', sets: 3, reps: '15', weight: '15kg' },
    ],
    posture: '注意肩胛骨下沉，不要耸肩',
  },
  {
    plan_id: '2026-05-26_肩部',
    title: '肩部训练',
    date: '2026-05-26',
    status: '待执行',
    duration: 50,
    warmup: [
      { name: '肩袖热身', sets: 2, reps: '15' },
      { name: '弹力带外旋', sets: 2, reps: '12' },
    ],
    main: [
      { name: '哑铃推举', sets: 4, reps: '8-10', weight: '22.5kg', rest: '90s' },
      { name: '侧平举', sets: 4, reps: '12', weight: '10kg', rest: '60s' },
      { name: '面拉', sets: 3, reps: '15', weight: '15kg', rest: '60s' },
    ],
    finisher: [
      { name: '前平举', sets: 3, reps: '12', weight: '8kg' },
      { name: '哑铃耸肩', sets: 3, reps: '15', weight: '15kg' },
    ],
    posture: '推举时核心收紧，不要过度后仰',
  },
];

// Mock 饮食记录
export const mockDietRecords: DietRecord[] = [
  {
    id: 'diet-2026-05-22-breakfast',
    date: '2026-05-22',
    meal: 'breakfast',
    foods: [
      { name: '燕麦', amount: '80g', calories: 300 },
      { name: '鸡蛋', amount: '3个', calories: 210 },
      { name: '牛奶', amount: '250ml', calories: 150 },
      { name: '香蕉', amount: '1根', calories: 90 },
    ],
    totalCalories: 750,
    macros: { protein: 35, carbs: 80, fat: 20 },
  },
  {
    id: 'diet-2026-05-22-lunch',
    date: '2026-05-22',
    meal: 'lunch',
    foods: [
      { name: '鸡胸肉', amount: '200g', calories: 330 },
      { name: '糙米饭', amount: '200g', calories: 220 },
      { name: '西兰花', amount: '150g', calories: 50 },
      { name: '橄榄油', amount: '10ml', calories: 90 },
    ],
    totalCalories: 690,
    macros: { protein: 45, carbs: 60, fat: 25 },
  },
  {
    id: 'diet-2026-05-22-dinner',
    date: '2026-05-22',
    meal: 'dinner',
    foods: [
      { name: '三文鱼', amount: '150g', calories: 280 },
      { name: '红薯', amount: '200g', calories: 180 },
      { name: '蔬菜沙拉', amount: '200g', calories: 80 },
    ],
    totalCalories: 540,
    macros: { protein: 35, carbs: 50, fat: 15 },
  },
  {
    id: 'diet-2026-05-22-snack',
    date: '2026-05-22',
    meal: 'snack',
    foods: [
      { name: '蛋白粉', amount: '30g', calories: 120 },
      { name: '坚果', amount: '30g', calories: 180 },
    ],
    totalCalories: 300,
    macros: { protein: 25, carbs: 10, fat: 15 },
  },
];

// Mock 周汇总
export const mockWeeklySummary: WeeklySummary = {
  trainingDays: 4,
  totalDuration: 220,
  totalCalories: 2280,
  averageRPE: 7.5,
  ratingDistribution: {
    great: 2,
    good: 2,
    okay: 1,
    bad: 0,
  },
};

// Mock 教练回复
export const mockCoachResponses: CoachResponse[] = [
  {
    input: '今天练什么',
    output: `**背部训练计划**

状态评估：根据上次训练（5月22日），整体完成度不错，划船重量稳定。

**热身（5分钟）**
- 肩袖热身 2组x15次
- 弹力带拉伸 2组x12次

**主训练（45分钟）**
1. 坐姿划船 4组x10次x50kg（休息90s）
2. 高位下拉 4组x10-12次x45kg（休息90s）
3. 单臂哑铃划船 3组x12次x20kg（休息60s）

**收尾（10分钟）**
- 直臂下压 3组x15次x15kg
- 面拉 3组x15次x15kg

**提醒**
- 单侧动作左侧先做
- 高位下拉最后两组可能吃力，控制在10个即可
- 肩胛骨下沉，不要耸肩`,
  },
  {
    input: '训练复盘',
    output: `**训练复盘 - 5月22日背部训练**

**整体评分：B+**

**完成度分析**
- 坐姿划船：完成 ✓（4x10x50kg）
- 高位下拉：完成 ✓（4x10-12x45kg，最后两组10个）
- 单臂划船：完成 ✓（3x12x20kg，左侧先做）
- 面拉：跳过 ✓（昨天练肩已做过）

**亮点**
- 划船重量稳定，动作质量好
- 左侧先做的意识正确

**优化建议**
- 高位下拉最后两组可以减重到40kg，保证12个
- 下次可以加入直臂下压增加背部宽度刺激

**补充剂影响**
- 未提及补充剂使用，建议训练前30分钟服用肌酸5g`,
  },
];
