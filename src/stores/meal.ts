import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DailyMeal, MealItem, MealTime } from '@/types/food'

export const useMealStore = defineStore('meal', () => {
    const dailyMeal = ref<DailyMeal>({
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
    })

    const currentMealTime = ref<MealTime>('breakfast')

    function addFoodToMeal(mealTime: MealTime, item: MealItem) {
        dailyMeal.value[mealTime].push(item)
    }

    function removeFoodFromMeal(mealTime: MealTime, index: number) {
        dailyMeal.value[mealTime].splice(index, 1)
    }

    function updateFoodAmount(mealTime: MealTime, index: number, amount: number) {
        if (dailyMeal.value[mealTime][index]) {
            dailyMeal.value[mealTime][index].amount = amount
        }
    }

    function clearMeal(mealTime: MealTime) {
        dailyMeal.value[mealTime] = []
    }

    function clearAllMeals() {
        dailyMeal.value = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: []
        }
    }

    function setCurrentMealTime(mealTime: MealTime) {
        currentMealTime.value = mealTime
    }

    return {
        dailyMeal,
        currentMealTime,
        addFoodToMeal,
        removeFoodFromMeal,
        updateFoodAmount,
        clearMeal,
        clearAllMeals,
        setCurrentMealTime
    }
})
