<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Upload, Image as ImageIcon, Sparkles } from 'lucide-vue-next'
import type { Food } from '@/types/food'

interface Props {
  isVisible: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'add', food: Food, amount: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedImage = ref<File | null>(null)
const previewUrl = ref('')
const isAnalyzing = ref(false)
const analyzedFoods = ref<Food[]>([])

// Computed properties for better performance
const hasResults = computed(() => analyzedFoods.value.length > 0)
const showAnalyzeButton = computed(() => !isAnalyzing.value && !hasResults.value)

const handleImageSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedImage.value = file
    const url = URL.createObjectURL(file)
    previewUrl.value = url
  }
}

const handleAnalyze = async () => {
  if (!selectedImage.value) return

  isAnalyzing.value = true

  // TODO: 실제 AI 이미지 분석 API 호출
  // Mock 분석 결과
  setTimeout(() => {
    const mockResults: Food[] = [
      {
        code: `ai-${Date.now()}-1`,
        name: '김치찌개',
        category: 'AI분석',
        servingSize: '1인분(300g)',
        calories: 150,
        carbs: 10,
        protein: 12,
        fat: 8,
        sugar: 3,
        sodium: 850,
      },
      {
        code: `ai-${Date.now()}-2`,
        name: '밥',
        category: 'AI분석',
        servingSize: '1공기(210g)',
        calories: 310,
        carbs: 68,
        protein: 6,
        fat: 0.5,
        sugar: 0.1,
        sodium: 2,
      },
    ]
    
    analyzedFoods.value = mockResults
    isAnalyzing.value = false
  }, 2000)
}

const handleAddFood = (food: Food) => {
  emit('add', food, 1)
  // 추가 후 목록에서 제거
  analyzedFoods.value = analyzedFoods.value.filter(f => f.code !== food.code)
}

const handleReset = () => {
  selectedImage.value = null
  previewUrl.value = ''
  analyzedFoods.value = []
  isAnalyzing.value = false
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
        v-if="isVisible"
        class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4"
        @click="emit('close')"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 scale-95 translate-y-8"
          leave-to-class="opacity-0 scale-95 translate-y-8"
        >
          <div
            v-if="isVisible"
            class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <!-- Header -->
            <div class="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 p-6 rounded-t-3xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles :size="20" class="text-white" />
                  </div>
                  <div>
                    <h2 class="text-white mb-1">AI 이미지 분석</h2>
                    <p class="text-sm text-white/90">사진을 업로드하면 AI가 음식을 분석해요</p>
                  </div>
                </div>
                <button
                  @click="emit('close')"
                  class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X :size="20" class="text-white" />
                </button>
              </div>
            </div>

            <div class="p-6 space-y-6">
              <!-- Upload Area -->
              <label v-if="!previewUrl" class="block">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageSelect"
                  class="hidden"
                />
                <div
                  v-motion
                  :hovered="{ scale: 1.02 }"
                  :tapped="{ scale: 0.98 }"
                  class="border-3 border-dashed border-emerald-200 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
                >
                  <Upload :size="64" class="text-emerald-400 mx-auto mb-4" />
                  <p class="text-gray-700 mb-2">클릭하여 이미지 업로드</p>
                  <p class="text-sm text-gray-500">또는 이미지를 드래그 앤 드롭</p>
                </div>
              </label>

              <div v-else class="space-y-4">
                <!-- Preview -->
                <div class="relative">
                  <img
                    :src="previewUrl"
                    alt="Preview"
                    class="w-full h-64 object-cover rounded-2xl"
                  />
                  <button
                    @click="handleReset"
                    class="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <X :size="16" class="text-gray-700" />
                  </button>
                </div>

                <!-- Analyze Button -->
                <button
                  v-if="showAnalyzeButton"
                  v-motion
                  :hovered="{ scale: 1.02 }"
                  :tapped="{ scale: 0.98 }"
                  @click="handleAnalyze"
                  class="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                >
                  <Sparkles :size="20" />
                  <span>AI로 분석하기</span>
                </button>

                <!-- Analyzing Animation -->
                <div v-if="isAnalyzing" class="text-center py-8">
                  <div
                    v-motion
                    :animate="{ rotate: 360 }"
                    :transition="{ duration: 2000, repeat: Infinity, ease: 'linear' }"
                    class="w-16 h-16 mx-auto mb-4"
                  >
                    <Sparkles :size="64" class="text-emerald-500" />
                  </div>
                  <p class="text-gray-700 mb-2">AI가 분석 중...</p>
                  <p class="text-sm text-gray-500">잠시만 기다려주세요</p>
                </div>

                <!-- Analysis Results -->
                <div v-if="hasResults" class="space-y-3">
                  <div class="flex items-center gap-2 text-emerald-600">
                    <ImageIcon :size="20" />
                    <h3 class="font-semibold">분석 결과 ({{ analyzedFoods.length }}개)</h3>
                  </div>
                  
                  <div
                    v-for="food in analyzedFoods"
                    v-motion
                    :initial="{ opacity: 0, y: 20 }"
                    :enter="{ opacity: 1, y: 0 }"
                      :key="food.code"
                      class="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200"
                    >
                      <div class="flex items-center justify-between mb-3">
                        <div>
                          <h4 class="text-gray-800 font-semibold">{{ food.name }}</h4>
                          <p class="text-sm text-gray-500">{{ food.servingSize }}</p>
                        </div>
                        <button
                          v-motion
                          :hovered="{ scale: 1.05 }"
                          :tapped="{ scale: 0.95 }"
                          @click="handleAddFood(food)"
                          class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                        >
                          추가
                        </button>
                      </div>
                      
                      <div class="grid grid-cols-4 gap-2 text-xs">
                        <div class="bg-white rounded-lg p-2 text-center">
                          <div class="text-gray-500 mb-1">칼로리</div>
                          <div class="text-gray-800 font-semibold">{{ food.calories }}kcal</div>
                        </div>
                        <div class="bg-white rounded-lg p-2 text-center">
                          <div class="text-gray-500 mb-1">탄수화물</div>
                          <div class="text-gray-800 font-semibold">{{ food.carbs }}g</div>
                        </div>
                        <div class="bg-white rounded-lg p-2 text-center">
                          <div class="text-gray-500 mb-1">단백질</div>
                          <div class="text-gray-800 font-semibold">{{ food.protein }}g</div>
                        </div>
                        <div class="bg-white rounded-lg p-2 text-center">
                          <div class="text-gray-500 mb-1">지방</div>
                          <div class="text-gray-800 font-semibold">{{ food.fat }}g</div>
                        </div>
                      </div>
                    </div>

                  <button
                    v-motion
                    :hovered="{ scale: 1.02 }"
                    :tapped="{ scale: 0.98 }"
                    @click="emit('close')"
                    class="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    완료
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

