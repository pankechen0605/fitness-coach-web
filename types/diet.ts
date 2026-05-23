// 食物
export interface Food {
  name: string;
  amount: string;
  calories: number;
}

// 宏量营养素
export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

// 饮食记录
export interface DietRecord {
  id: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Food[];
  totalCalories: number;
  macros: Macros;
}
