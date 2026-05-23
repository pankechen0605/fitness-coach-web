# Plan Generator Prompt

## 任务

根据用户状态和历史数据，生成训练计划。

## 输入

- 用户当前状态（如：状态好、状态一般、有点疲劳、喝了肌酸）
- 最近训练记录（最近 3-5 次）
- 用户提到的伤病或不适

## 输出格式

```json
{
  "plan_id": "YYYY-MM-DD_部位",
  "title": "部位训练",
  "date": "YYYY-MM-DD",
  "status": "用户当前状态",
  "duration": "预计时长（分钟）",
  "warmup": [
    {"name": "动作名", "sets": 2, "reps": "15"}
  ],
  "main": [
    {"name": "动作名", "sets": 3, "reps": "8-10", "weight": "建议重量", "rest": "90s"}
  ],
  "finisher": [
    {"name": "动作名", "sets": 3, "reps": "15", "posture": true}
  ],
  "posture": "体态提醒"
}
```

## 考虑因素

1. **恢复情况**：上次训练的部位和强度
2. **用户状态**：疲劳、补充剂、睡眠等
3. **容量管理**：单部位 60-80 次
4. **动作排序**：复合 → 拉背 → 孤立
5. **左右不对称**：弱侧先做

## 示例

用户说"今天练什么"，上次练了背（5月22日，RPE 7，评分 good）。

输出：
```json
{
  "plan_id": "2026-05-24_背部",
  "title": "背部训练",
  "date": "2026-05-24",
  "status": "待执行",
  "duration": 60,
  "warmup": [
    {"name": "肩袖热身", "sets": 2, "reps": "15"},
    {"name": "弹力带拉伸", "sets": 2, "reps": "12"}
  ],
  "main": [
    {"name": "坐姿划船", "sets": 4, "reps": "10", "weight": "50kg", "rest": "90s"},
    {"name": "高位下拉", "sets": 4, "reps": "10-12", "weight": "45kg", "rest": "90s"},
    {"name": "单臂哑铃划船", "sets": 3, "reps": "12", "weight": "20kg", "rest": "60s"}
  ],
  "finisher": [
    {"name": "直臂下压", "sets": 3, "reps": "15", "weight": "15kg", "posture": true},
    {"name": "面拉", "sets": 3, "reps": "15", "weight": "15kg"}
  ],
  "posture": "注意肩胛骨下沉，不要耸肩"
}
```
