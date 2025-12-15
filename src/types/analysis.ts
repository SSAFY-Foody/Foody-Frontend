import type { Food, MealTime } from './food';

export interface UserInfo {
    name: string;
    age: number;
    height: number; // cm
    weight: number; // kg
    gender: 'male' | 'female';
    activityLevel: 'low' | 'moderate' | 'high' | 'very-high';
}

export interface NutritionTotals {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    sugar: number;
    sodium: number;
}

export interface RecommendedNutrition {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    sugar: number;
    sodium: number;
}

export interface MealSummary {
    mealTime: MealTime;
    foods: Food[];
    totals: NutritionTotals;
}

export interface AnalysisResult {
    userId: string;
    userName: string;
    userInfo: UserInfo;
    score: number; // 0-100
    comment: string;
    dailyTotals: NutritionTotals;
    recommended: RecommendedNutrition;
    characterId: number;
    characterName: string;
    meals: MealSummary[];
    analysisDate: string;
}
