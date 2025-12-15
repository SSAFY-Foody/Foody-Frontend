<script setup lang="ts">
import { useRouter } from 'vue-router'
import { User, Ruler, Weight, Activity, Calendar, TrendingUp, Apple, Trash2, List } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import NutritionGauge from '@/components/NutritionGauge.vue'

const router = useRouter()

// Mock 데이터
const mockAnalysisResult = {
  userId: 'user123',
  userName: '김푸디',
  userInfo: {
    name: '김푸디',
    age: 25,
    height: 170,
    weight: 65,
    gender: 'female' as 'male' | 'female',
    activityLevel: 'moderate' as 'low' | 'moderate' | 'high' | 'very-high'
  },
  score: 85,
  comment: '훌륭한 식습관이에요! 단백질 섭취가 충분하고 균형잡힌 식단입니다. 다만 나트륨 섭취를 조금 줄이면 더욱 건강한 식단이 될 거예요. 이대로 꾸준히 유지하세요! 💚',
  dailyTotals: {
    calories: 1850,
    carbs: 220,
    protein: 95,
    fat: 55,
    sugar: 35,
    sodium: 2100
  },
  recommended: {
    calories: 2000,
    carbs: 250,
    protein: 80,
    fat: 60,
    sugar: 50,
    sodium: 2000
  },
  characterId: 2,
  characterName: '건강 푸디',
  meals: [
    {
      mealTime: 'breakfast' as const,
      foods: [
        { id: '1', name: '현미밥', category: '밥류', calories: 300, carbs: 65, protein: 7, fat: 2, sugar: 0, sodium: 5, amount: 200 },
        { id: '2', name: '계란후라이', category: '계란류', calories: 150, carbs: 1, protein: 13, fat: 11, sugar: 0, sodium: 140, amount: 100 }
      ],
      totals: { calories: 450, carbs: 66, protein: 20, fat: 13, sugar: 0, sodium: 145 }
    },
    {
      mealTime: 'lunch' as const,
      foods: [
        { id: '3', name: '닭가슴살 샐러드', category: '샐러드', calories: 350, carbs: 25, protein: 45, fat: 10, sugar: 8, sodium: 650, amount: 300 },
        { id: '4', name: '고구마', category: '간식', calories: 130, carbs: 30, protein: 2, fat: 0, sugar: 10, sodium: 20, amount: 150 }
      ],
      totals: { calories: 480, carbs: 55, protein: 47, fat: 10, sugar: 18, sodium: 670 }
    },
    {
      mealTime: 'dinner' as const,
      foods: [
        { id: '5', name: '연어 스테이크', category: '생선류', calories: 400, carbs: 5, protein: 40, fat: 25, sugar: 2, sodium: 300, amount: 200 },
        { id: '6', name: '브로콜리', category: '채소류', calories: 55, carbs: 11, protein: 5, fat: 0, sugar: 3, sodium: 50, amount: 150 },
        { id: '7', name: '현미밥', category: '밥류', calories: 300, carbs: 65, protein: 7, fat: 2, sugar: 0, sodium: 5, amount: 200 }
      ],
      totals: { calories: 755, carbs: 81, protein: 52, fat: 27, sugar: 5, sodium: 355 }
    },
    {
      mealTime: 'snack' as const,
      foods: [
        { id: '8', name: '그릭 요거트', category: '유제품', calories: 100, carbs: 8, protein: 10, fat: 3, sugar: 7, sodium: 60, amount: 150 },
        { id: '9', name: '아몬드', category: '견과류', calories: 165, carbs: 10, protein: 6, fat: 14, sugar: 5, sodium: 200, amount: 30 }
      ],
      totals: { calories: 265, carbs: 18, protein: 16, fat: 17, sugar: 12, sodium: 260 }
    }
  ],
  analysisDate: new Date().toISOString()
}

const mealTimeNames = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식'
}

const activityLevelNames = {
  low: '낮음',
  moderate: '보통',
  high: '높음',
  'very-high': '매우 높음'
}

const handleDeleteReport = () => {
  if (window.confirm('이 분석 레포트를 삭제하시겠습니까?')) {
    alert('레포트가 삭제되었습니다.')
    router.push('/my-page')
  }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-emerald-600'
  if (score >= 75) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

const getScoreGradient = (score: number) => {
  if (score >= 90) return 'from-emerald-500 to-green-600'
  if (score >= 75) return 'from-green-500 to-emerald-600'
  if (score >= 60) return 'from-yellow-500 to-orange-500'
  if (score >= 40) return 'from-orange-500 to-red-500'
  return 'from-red-500 to-pink-600'
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
    <Navbar />

    <!-- 서브 헤더 -->
    <div
      v-motion
      :initial="{ y: -20, opacity: 0 }"
      :enter="{ y: 0, opacity: 1 }"
      class="bg-white border-b border-gray-200"
    >
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-gray-900">식단 분석 결과</h1>
        <div class="flex items-center gap-2">
          <button
            @click="router.push('/my-page')"
            class="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
          >
            <List :size="20" />
            <span class="text-sm">레포트 목록</span>
          </button>
          <button
            @click="handleDeleteReport"
            class="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 :size="20" />
            <span class="text-sm">삭제</span>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <!-- 점수 & 캐릭터 섹션 -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
        class="bg-white rounded-3xl shadow-lg p-8 border-2 border-emerald-100"
      >
        <div class="flex flex-col md:flex-row items-center gap-8">
          <!-- 캐릭터 -->
          <div class="flex-shrink-0">
            <div
              v-motion
              :animate="{
                y: [0, -10, 0],
              }"
              :transition="{
                duration: 2000,
                repeat: Infinity,
                ease: 'easeInOut'
              }"
              class="w-48 h-48 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center text-8xl"
            >
              🌱
            </div>
            <p class="text-center mt-4 text-gray-700">{{ mockAnalysisResult.characterName }}</p>
          </div>

          <!-- 점수 & 코멘트 -->
          <div class="flex-1 space-y-4">
            <div>
              <p class="text-sm text-gray-500 mb-2">{{ mockAnalysisResult.userName }}님의 식단 점수</p>
              <div class="flex items-end gap-3">
                <div
                  v-motion
                  :initial="{ scale: 0 }"
                  :enter="{ scale: 1, transition: { type: 'spring', delay: 300 } }"
                  :class="getScoreColor(mockAnalysisResult.score)"
                >
                  <span class="text-6xl">{{ mockAnalysisResult.score }}</span>
                  <span class="text-3xl">점</span>
                </div>
                <span class="text-gray-400 text-xl mb-2">/ 100점</span>
              </div>
            </div>

            <!-- 점수 게이지 -->
            <div class="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                v-motion
                :initial="{ width: '0%' }"
                :enter="{ width: `${mockAnalysisResult.score}%`, transition: { duration: 1500, delay: 500 } }"
                :class="['h-full bg-gradient-to-r', getScoreGradient(mockAnalysisResult.score)]"
              ></div>
            </div>

            <!-- AI 코멘트 -->
            <div class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200">
              <div class="flex items-start gap-3">
                <span class="text-3xl flex-shrink-0">💬</span>
                <div>
                  <p class="text-sm text-emerald-700 mb-2">AI 푸디의 코멘트</p>
                  <p class="text-gray-700 leading-relaxed">{{ mockAnalysisResult.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 하루 총 영양소 & 권장량 비교 -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
        class="bg-white rounded-3xl shadow-lg p-8"
      >
        <h2 class="text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp :size="24" class="text-emerald-600" />
          하루 영양소 섭취 현황
        </h2>

        <div class="grid md:grid-cols-2 gap-6">
          <NutritionGauge
            label="칼로리"
            :current="mockAnalysisResult.dailyTotals.calories"
            :recommended="mockAnalysisResult.recommended.calories"
            unit="kcal"
            color="bg-gradient-to-r from-purple-500 to-pink-500"
          />
          <NutritionGauge
            label="탄수화물"
            :current="mockAnalysisResult.dailyTotals.carbs"
            :recommended="mockAnalysisResult.recommended.carbs"
            unit="g"
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
          />
          <NutritionGauge
            label="단백질"
            :current="mockAnalysisResult.dailyTotals.protein"
            :recommended="mockAnalysisResult.recommended.protein"
            unit="g"
            color="bg-gradient-to-r from-emerald-500 to-green-500"
          />
          <NutritionGauge
            label="지방"
            :current="mockAnalysisResult.dailyTotals.fat"
            :recommended="mockAnalysisResult.recommended.fat"
            unit="g"
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
          />
          <NutritionGauge
            label="당류"
            :current="mockAnalysisResult.dailyTotals.sugar"
            :recommended="mockAnalysisResult.recommended.sugar"
            unit="g"
            color="bg-gradient-to-r from-pink-500 to-rose-500"
          />
          <NutritionGauge
            label="나트륨"
            :current="mockAnalysisResult.dailyTotals.sodium"
            :recommended="mockAnalysisResult.recommended.sodium"
            unit="mg"
            color="bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>
      </div>

      <!-- 유저 정보 -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
        class="bg-white rounded-3xl shadow-lg p-8"
      >
        <h2 class="text-gray-900 mb-6 flex items-center gap-2">
          <User :size="24" class="text-emerald-600" />
          분석 당시 유저 정보
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
            <Calendar :size="32" class="text-blue-600" />
            <div>
              <p class="text-xs text-gray-600">나이</p>
              <p class="text-gray-900">{{ mockAnalysisResult.userInfo.age }}세</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <Ruler :size="32" class="text-purple-600" />
            <div>
              <p class="text-xs text-gray-600">키</p>
              <p class="text-gray-900">{{ mockAnalysisResult.userInfo.height }}cm</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <Weight :size="32" class="text-green-600" />
            <div>
              <p class="text-xs text-gray-600">몸무게</p>
              <p class="text-gray-900">{{ mockAnalysisResult.userInfo.weight }}kg</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl">
            <User :size="32" class="text-pink-600" />
            <div>
              <p class="text-xs text-gray-600">성별</p>
              <p class="text-gray-900">{{ mockAnalysisResult.userInfo.gender === 'male' ? '남성' : '여성' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
            <Activity :size="32" class="text-orange-600" />
            <div>
              <p class="text-xs text-gray-600">활동량</p>
              <p class="text-gray-900">{{ activityLevelNames[mockAnalysisResult.userInfo.activityLevel] }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-lime-50 rounded-2xl">
            <Calendar :size="32" class="text-yellow-600" />
            <div>
              <p class="text-xs text-gray-600">분석일</p>
              <p class="text-gray-900 text-sm">{{ new Date(mockAnalysisResult.analysisDate).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 끼니별 상세 정보 -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
        class="bg-white rounded-3xl shadow-lg p-8"
      >
        <h2 class="text-gray-900 mb-6 flex items-center gap-2">
          <Apple :size="24" class="text-emerald-600" />
          끼니별 상세 정보
        </h2>

        <div class="space-y-6">
          <div
            v-for="(meal, index) in mockAnalysisResult.meals"
            :key="meal.mealTime"
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :enter="{ opacity: 1, x: 0, transition: { delay: 500 + index * 100 } }"
            class="border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-300 transition-colors"
          >
            <!-- 끼니 헤더 -->
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-gray-900">{{ mealTimeNames[meal.mealTime] }}</h3>
              <div class="flex items-center gap-4 text-sm">
                <span class="text-purple-600">{{ meal.totals.calories }}kcal</span>
                <span class="text-blue-600">탄 {{ meal.totals.carbs }}g</span>
                <span class="text-emerald-600">단 {{ meal.totals.protein }}g</span>
                <span class="text-orange-600">지 {{ meal.totals.fat }}g</span>
              </div>
            </div>

            <!-- 음식 목록 -->
            <div class="space-y-3">
              <div
                v-for="food in meal.foods"
                :key="food.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div class="flex-1">
                  <p class="text-gray-900">{{ food.name }}</p>
                  <p class="text-sm text-gray-500">{{ food.category }} · {{ food.amount }}g</p>
                </div>
                <div class="flex gap-3 text-sm">
                  <span class="text-purple-600">{{ food.calories }}kcal</span>
                  <span class="text-gray-300">|</span>
                  <span class="text-blue-600">탄 {{ food.carbs }}g</span>
                  <span class="text-emerald-600">단 {{ food.protein }}g</span>
                  <span class="text-orange-600">지 {{ food.fat }}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 다시 분석하기 버튼 -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 600 } }"
        class="flex justify-center gap-4"
      >
        <button
          @click="router.push('/meal-management')"
          class="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:shadow-lg transition-all hover:scale-105"
        >
          새로운 식단 분석하기
        </button>
        <button
          @click="router.push('/characters')"
          class="px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-500 rounded-2xl hover:bg-emerald-50 transition-all"
        >
          푸디 도감 보기
        </button>
      </div>
    </div>
  </div>
</template>
