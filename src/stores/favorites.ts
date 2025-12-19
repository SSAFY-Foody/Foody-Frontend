import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { foodApi } from '@/api/food.api'
import type { FavoriteResponse } from '@/api/types'
import { showError } from '@/utils/errorHandler'

export const useFavoriteStore = defineStore('favorites', () => {
  // State
  const favorites = ref<FavoriteResponse[]>([])
  const isLoading = ref(false)
  const error = ref('')

  // Getters
  // 음식 코드로 찜 여부 확인을 위한 Set (성능 최적화)
  const favoriteFoodCodes = computed(() => {
    const codes = new Set<string>()
    favorites.value.forEach(fav => {
      if (fav.foodCode) codes.add(fav.foodCode)
      // 사용자 정의 음식은 userFoodCode 사용
      if (fav.userFoodCode) codes.add(fav.userFoodCode.toString())
    })
    return codes
  })

  // Actions
  const fetchFavorites = async () => {
    isLoading.value = true
    error.value = ''
    try {
      favorites.value = await foodApi.getFavoriteList()
    } catch (err) {
      error.value = showError(err)
      console.error('Failed to fetch favorites:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addFavorite = async (foodCode: string, isUserFood: boolean = false) => {
    isLoading.value = true
    error.value = ''
    try {
      const request = isUserFood 
        ? { foodCode: '', userFoodCode: parseInt(foodCode) } // 사용자 정의 음식인 경우
        : { foodCode } // 일반 음식인 경우
        
      await foodApi.addFavorite(request)
      await fetchFavorites() // 목록 갱신
    } catch (err) {
      error.value = showError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeFavorite = async (favoriteId: number) => {
    isLoading.value = true
    error.value = ''
    try {
      await foodApi.deleteFavorite(favoriteId)
      // 로컬 상태 업데이트 (불필요한 API 호출 방지)
      favorites.value = favorites.value.filter(fav => fav.favoriteId !== favoriteId)
    } catch (err) {
      error.value = showError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 음식 코드로 찜한 항목 ID 찾기
  const findFavoriteIdByCode = (foodCode: string): number | undefined => {
    const found = favorites.value.find(fav => 
      fav.foodCode === foodCode || 
      (fav.userFoodCode && fav.userFoodCode.toString() === foodCode)
    )
    return found?.favoriteId
  }

  const isFavorite = (foodCode: string): boolean => {
    return favoriteFoodCodes.value.has(foodCode)
  }

  const clearError = () => {
    error.value = ''
  }

  return {
    favorites,
    isLoading,
    error,
    favoriteFoodCodes,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    findFavoriteIdByCode,
    isFavorite,
    clearError
  }
})
