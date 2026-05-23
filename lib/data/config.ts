// 数据源配置
export const DATA_CONFIG = {
  // 本地数据目录（PR1.2 接入时使用）
  LOCAL_DATA_DIR: 'D:/AI_Project/fitnessCOACH',

  // 数据文件路径
  FILES: {
    TRAINING_LOG: 'training_log.json',
    DIET_LOG: 'diet_log.json',
    TRAINING_PLANS: 'training_plans',
  },

  // Mock 数据标识（false = 使用本地 JSON）
  USE_MOCK: false,
} as const;
