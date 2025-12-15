<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Search, X, Plus, Heart, ChevronLeft, ChevronRight, Upload } from 'lucide-vue-next'
import { mockFoods, categories } from '@/data/mockFoods'
import type { Food, MealTime } from '@/types/food'
import AddFoodManually from './AddFoodManually.vue'
import AddFoodByImage from './AddFoodByImage.vue'

const ITEMS_PER_PAGE = 8

const MEAL_LABELS: Record<MealTime, string> = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식'
}

interface Props {
  isOpen: boolean
  mealTime: MealTime
}

interface Emits {
  (e: 'close'): void
  (e: 'add-food', food: Food, amount: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const selectedCategory = ref('전체')
const currentPage = ref(1)
const foodAmounts = ref<Record<string, number>>({})
const favoriteFoods = ref<string[]>([])
const customFoods = ref<Food[]>([])
const showManualAdd = ref(false)
const showImageAdd = ref(false)

onMounted(() => {
  const savedFavorites = localStorage.getItem('favoriteFoods')
  if (savedFavorites) {
    favoriteFoods.value = JSON.parse(savedFavorites)
  }

  const savedCustomFoods = localStorage.getItem('customFoods')
  if (savedCustomFoods) {
    customFoods.value = JSON.parse(savedCustomFoods)
  }
})

const toggleFavorite = (foodId: string) => {
  if (favoriteFoods.value.includes(foodId)) {
    favoriteFoods.value = favoriteFoods.value.filter(id => id !== foodId)
  } else {
    favoriteFoods.value = [...favoriteFoods.value, foodId]
  }
  localStorage.setItem('favoriteFoods', JSON.stringify(favoriteFoods.value))
}

// 전체 음식 목록 (mockFoods + customFoods)
const allFoods = computed(() => [...mockFoods, ...customFoods.value])

const filteredFoods = computed(() => {
  return allFoods.value.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    if (selectedCategory.value === '찜한 음식') {
      return matchesSearch && favoriteFoods.value.includes(food.id)
    } else if (selectedCategory.value === '직접 입력') {
      return matchesSearch && customFoods.value.some(cf => cf.id === food.id)
    } else if (selectedCategory.value === '전체') {
      return matchesSearch
    } else {
      return matchesSearch && food.category === selectedCategory.value
    }
  })
})

const totalPages = computed(() => Math.ceil(filteredFoods.value.length / ITEMS_PER_PAGE))
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)
const endIndex = computed(() => startIndex.value + ITEMS_PER_PAGE)
const currentFoods = computed(() => filteredFoods.value.slice(startIndex.value, endIndex.value))

watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

const getFoodAmount = (foodId: string) => {
  return foodAmounts.value[foodId] || 100
}

const setFoodAmount = (foodId: string, amount: number) => {
  if (amount >= 1 && amount <= 10000) {
    foodAmounts.value[foodId] = amount
  }
}

const handleAddFood = (food: Food, amount: number) => {
  emit('add-food', food, amount)
  emit('close')
  searchQuery.value = ''
  selectedCategory.value = '전체'
  currentPage.value = 1
  foodAmounts.value = {}
}

const handleClose = () => {
  emit('close')
}

const handleManualAdd = (food: Food) => {
  // customFoods 목록 업데이트
  const savedCustomFoods = localStorage.getItem('customFoods')
  customFoods.value = savedCustomFoods ? JSON.parse(savedCustomFoods) : []
  
  // 음식을 현재 식사에 추가
  emit('add-food', food, 100)
  showManualAdd.value = false
}

const handleImageAdd = (food: Food, amount: number) => {
  emit('add-food', food, amount)
  // 이미지 모달은 닫지 않음 (여러 음식 추가 가능)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        @click="handleClose"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition-all duration-200"
      leave-active-class="transition-all duration-200"
      enter-from-class="opacity-0 scale-95 translate-y-5"
      leave-to-class="opacity-0 scale-95 translate-y-5"
    >
      <div
        v-if="isOpen"
        class="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 flex items-center justify-between">
          <h2 class="text-white">{{ MEAL_LABELS[mealTime] }} - 음식 추가</h2>
          <button
            v-motion
            :hovered="{ scale: 1.1 }"
            :tapped="{ scale: 0.9 }"
            @click="handleClose"
            class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X :size="20" class="text-white" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mb-6">
            <button
              v-motion
              :hovered="{ scale: 1.02 }"
              :tapped="{ scale: 0.98 }"
              @click="showManualAdd = true"
              class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
            >
              <Plus :size="16" />
              <span>직접 입력</span>
            </button>
            <button
              v-motion
              :hovered="{ scale: 1.02 }"
              :tapped="{ scale: 0.98 }"
              @click="showImageAdd = true"
              class="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
            >
              <Upload :size="16" />
              <span>사진으로 추가</span>
            </button>
          </div>

          <!-- Search Bar -->
          <div class="relative mb-6">
            <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="음식 이름으로 검색..."
              class="w-full pl-12 pr-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <!-- Category Filter -->
          <div class="flex flex-wrap gap-2 mb-6">
            <button
              v-for="category in ['전체', '찜한 음식', '직접 입력', ...categories]"
              :key="category"
              v-motion
              :hovered="{ scale: 1.05 }"
              :tapped="{ scale: 0.95 }"
              @click="selectedCategory = category"
              :class="[
                'px-4 py-2 rounded-lg transition-all',
                selectedCategory === category
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category }}
            </button>
          </div>

          <!-- Food List -->
          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <div
              v-for="food in currentFoods"
              :key="food.id"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0 }"
              class="bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-xl p-4 border border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-md"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="text-gray-800 mb-1">{{ food.name }}</h3>
                  <span class="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs">
                    {{ food.category }}
                  </span>
                </div>
                <button
                  v-motion
                  :hovered="{ scale: 1.1 }"
                  :tapped="{ scale: 0.9 }"
                  @click="toggleFavorite(food.id)"
                  class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <Heart
                    :size="20"
                    :class="[
                      favoriteFoods.includes(food.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'
                    ]"
                  />
                </button>
              </div>

              <div class="text-sm text-gray-600 space-y-2 mb-3">
                <div class="flex justify-between">
                  <span>영양소 기준량</span>
                  <span class="text-gray-800">{{ food.servingSize }}</span>
                </div>
                <div class="flex justify-between">
                  <span>칼로리</span>
                  <span class="text-emerald-600">{{ food.calories }}kcal</span>
                </div>
                <div class="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-emerald-100">
                  <div>
                    <div class="text-xs text-gray-500">탄수화물</div>
                    <div class="text-blue-600">{{ food.carbs }}g</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">단백질</div>
                    <div class="text-red-600">{{ food.protein }}g</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">지방</div>
                    <div class="text-yellow-600">{{ food.fat }}g</div>
                  </div>
                </div>
              </div>

              <!-- Amount Input and Add Button -->
              <div class="flex items-center gap-2 pt-3 border-t border-emerald-100">
                <div class="flex-1">
                  <label class="text-xs text-gray-500 mb-1 block">먹은 양</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      step="1"
                      :value="getFoodAmount(food.id)"
                      @input="setFoodAmount(food.id, parseFloat(($event.target as HTMLInputElement).value) || 100)"
                      class="w-20 px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 text-center"
                    />
                    <span class="text-sm text-gray-600">g</span>
                  </div>
                </div>
                <button
                  v-motion
                  :hovered="{ scale: 1.05 }"
                  :tapped="{ scale: 0.95 }"
                  @click="handleAddFood(food, getFoodAmount(food.id))"
                  class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2 mt-5"
                >
                  <Plus :size="16" />
                  <span class="text-sm">추가</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center items-center gap-2">
            <button
              v-motion
              :hovered="{ scale: currentPage === 1 ? 1 : 1.1 }"
              :tapped="{ scale: currentPage === 1 ? 1 : 0.9 }"
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-2 rounded-lg bg-emerald-100 text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-200 transition-colors"
            >
              <ChevronLeft :size="20" />
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              v-motion
              :hovered="{ scale: 1.1 }"
              :tapped="{ scale: 0.9 }"
              @click="currentPage = page"
              :class="[
                'w-10 h-10 rounded-lg transition-colors',
                currentPage === page
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ page }}
            </button>

            <button
              v-motion
              :hovered="{ scale: currentPage === totalPages ? 1 : 1.1 }"
              :tapped="{ scale: currentPage === totalPages ? 1 : 0.9 }"
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-lg bg-emerald-100 text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-200 transition-colors"
            >
              <ChevronRight :size="20" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Manual Add Modal -->
    <AddFoodManually
      v-if="showManualAdd"
      @close="showManualAdd = false"
      @add="handleManualAdd"
    />

    <!-- Image Add Modal -->
    <AddFoodByImage
      :is-visible="showImageAdd"
      @close="showImageAdd = false"
      @add="handleImageAdd"
    />
  </Teleport>
</template>
