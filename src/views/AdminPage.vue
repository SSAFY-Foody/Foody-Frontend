<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Shield, Users, Apple, Activity, FileText,
  Save, X, Plus, Trash2, Edit2, ChevronDown, ChevronUp, Search, Check
} from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import { adminApi } from '@/api/admin.api'
import { foodApi } from '@/api/food.api'
import { reportApi } from '@/api/report.api'
import { characterApi } from '@/api/character.api'
import type { 
  FoodRequest, 
  ActivityLevelResponse, 
  WaitingReportResponse,
  ReportResponse,
  CharacterResponse
} from '@/api/types'
import FoodSearchModal from '@/components/FoodSearchModal.vue'

// 권한 관리
const activeTab = ref<'role' | 'food' | 'activity' | 'report'>('report') // 기본 탭: 레포트
const targetUserId = ref('')
const targetRole = ref<'ROLE_USER' | 'ROLE_ADMIN'>('ROLE_USER')
const isUpdatingRole = ref(false)

// 음식 관리
const isAddingFood = ref(false)
const isRegisterOpen = ref(false)
const isDeleteOpen = ref(false)
const showSearchModal = ref(false)

const newFood = ref<FoodRequest>({
  code: '',
  name: '',
  category: '',
  standard: '',
  kcal: 0,
  carb: 0,
  protein: 0,
  fat: 0,
  sugar: 0,
  natrium: 0,
})

const categories = ref<string[]>([])

// 활동 레벨 관리
const activityLevels = ref<ActivityLevelResponse[]>([])
const editingLevel = ref<ActivityLevelResponse | null>(null)

// 레포트 관리
const waitingReports = ref<WaitingReportResponse[]>([]) // 대기 목록
const selectedReportId = ref<number | null>(null)
const reportDetail = ref<ReportResponse | null>(null) // 상세 정보
const characters = ref<CharacterResponse[]>([]) // 캐릭터 목록
const isLoadingDetail = ref(false)

const reportScore = ref<number | ''>('')
const reportCharacterId = ref<number | null>(null)
const reportComment = ref('')

// 데이터 로드 함수들
const loadActivityLevels = async () => {
  try {
    activityLevels.value = await adminApi.getAllActivityLevels()
  } catch (error) {
    console.error('활동 레벨 로드 실패:', error)
  }
}

const loadWaitingReports = async () => {
  try {
    waitingReports.value = await adminApi.getWaitingReports()
  } catch (error) {
    console.error('대기 레포트 로드 실패:', error)
  }
}

const loadCharacters = async () => {
  if (characters.value.length > 0) return
  try {
    characters.value = await characterApi.getAllCharacters()
  } catch (error) {
    console.error('캐릭터 로드 실패:', error)
  }
}

onMounted(async () => {
  try {
    const [cats, levels, reports] = await Promise.all([
      foodApi.getCategories(),
      adminApi.getAllActivityLevels(),
      adminApi.getWaitingReports()
    ])
    categories.value = cats
    activityLevels.value = levels
    waitingReports.value = reports
  } catch (error) {
    console.error('데이터 로드 실패:', error)
  }
})

// 권한 수정 핸들러
const handleUpdateRole = async () => {
  if (!targetUserId.value) {
    alert('사용자 ID를 입력해주세요.')
    return
  }
  
  if (isUpdatingRole.value) return
  
  try {
    isUpdatingRole.value = true
    await adminApi.updateUserRole({
      userId: targetUserId.value,
      role: targetRole.value
    })
    alert(`사용자 ${targetUserId.value}의 권한이 ${targetRole.value}로 변경되었습니다.`)
    targetUserId.value = ''
    targetRole.value = 'ROLE_USER'
  } catch (error: any) {
    console.error('권한 수정 실패 사유:', error)
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data || 
      error.message || 
      '알 수 없는 오류가 발생했습니다'
    alert(`권한 수정에 실패했습니다: ${errorMessage}`)
  } finally {
    isUpdatingRole.value = false
  }
}

// 음식 등록 핸들러
const handleAddFood = async () => {
  if (!newFood.value.code || !newFood.value.name) {
    alert('음식 코드와 이름은 필수입니다.')
    return
  }

  try {
    isAddingFood.value = true
    await adminApi.addFood(newFood.value)
    alert(`음식 ${newFood.value.name}이(가) 등록되었습니다.`)
    
    // 폼 초기화
    newFood.value = {
      code: '',
      name: '',
      category: '',
      standard: '',
      kcal: 0,
      carb: 0,
      protein: 0,
      fat: 0,
      sugar: 0,
      natrium: 0,
    }
  } catch (error: any) {
    console.error('음식 등록 실패:', error)
    let errorMessage = 
      error.response?.data?.message || 
      error.response?.data || 
      error.message || 
      '알 수 없는 오류가 발생했습니다'
    
    if (typeof errorMessage === 'object') {
      errorMessage = Object.values(errorMessage).join('\n')
    }

    alert(`음식 등록에 실패했습니다:\n${errorMessage}`)
  } finally {
    isAddingFood.value = false
  }
}

// 활동 레벨 수정 핸들러
const handleUpdateActivityLevel = async () => {
  if (!editingLevel.value) return
  
  try {
    await adminApi.updateActivityLevel({
      level: editingLevel.value.level,
      value: editingLevel.value.value,
      description: editingLevel.value.description
    })
    
    alert('활동 레벨이 수정되었습니다.')
    await loadActivityLevels() // 목록 새로고침
    editingLevel.value = null
  } catch (error: any) {
    console.error('활동 레벨 수정 실패:', error)
     const errorMessage = 
      error.response?.data?.message || 
      error.response?.data || 
      error.message || 
      '알 수 없는 오류가 발생했습니다'
    alert(`수정 실패: ${errorMessage}`)
  }
}

// 레포트 상세 보기 및 작성 모드 진입
const handleSelectReport = async (reportId: number) => {
  selectedReportId.value = reportId
  isLoadingDetail.value = true
  
  try {
    // 상세 정보 및 캐릭터 목록 로드
    const [detail] = await Promise.all([
      reportApi.getReportDetail(reportId),
      loadCharacters()
    ])
    reportDetail.value = detail
    
    // 초기화
    reportScore.value = ''
    reportCharacterId.value = null
    reportComment.value = ''
    
  } catch (error) {
    console.error('레포트 상세 로드 실패:', error)
    alert('레포트 상세 정보를 불러오는데 실패했습니다.')
    selectedReportId.value = null
  } finally {
    isLoadingDetail.value = false
  }
}

// 레포트 작성 제출
const handleSubmitReport = async () => {
  if (!selectedReportId.value) return
  
  if (reportScore.value === '' || !reportCharacterId.value || !reportComment.value) {
    alert('점수, 캐릭터, 코멘트를 모두 입력해주세요.')
    return
  }

  try {
    await adminApi.updateWaitingReport({
      id: selectedReportId.value,
      score: Number(reportScore.value),
      characterId: reportCharacterId.value,
      comment: reportComment.value
    })

    alert('레포트 분석이 완료되었습니다.')
    
    // 목록 갱신 및 초기화
    await loadWaitingReports()
    selectedReportId.value = null
    reportDetail.value = null
    
  } catch (error: any) {
    console.error('레포트 작성 실패:', error)
    let errorMessage = 
      error.response?.data?.message || 
      error.response?.data || 
      error.message ||
      '알 수 없는 오류가 발생했습니다'

    if (typeof errorMessage === 'object') {
      // 객체인 경우 (Validation 에러 등) 보기 좋게 변환
      errorMessage = Object.entries(errorMessage)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
    }

    alert(`레포트 작성 실패:\n${errorMessage}`)
  }
}

const closeReportDetail = () => {
  selectedReportId.value = null
  reportDetail.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 헤더 -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        class="mb-8"
      >
        <div class="flex items-center gap-3 mb-2">
          <Shield :size="32" class="text-emerald-600" />
          <h1 class="text-gray-900">관리자 페이지</h1>
        </div>
        <p class="text-gray-600">시스템 관리 및 전문가 분석 작성</p>
      </div>

      <!-- 탭 네비게이션 -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        class="bg-white rounded-2xl shadow-md p-2 mb-8 grid grid-cols-2 md:grid-cols-4 gap-2"
      >
        <button
          @click="activeTab = 'report'"
          :class="[
            'py-3 px-4 rounded-xl transition-all text-sm md:text-base',
            activeTab === 'report'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <FileText :size="20" class="inline-block mr-1 md:mr-2" />
          레포트 관리
        </button>
        <button
          @click="activeTab = 'role'"
          :class="[
            'py-3 px-4 rounded-xl transition-all text-sm md:text-base',
            activeTab === 'role'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <Users :size="20" class="inline-block mr-1 md:mr-2" />
          권한 관리
        </button>
        <button
          @click="activeTab = 'food'"
          :class="[
            'py-3 px-4 rounded-xl transition-all text-sm md:text-base',
            activeTab === 'food'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <Apple :size="20" class="inline-block mr-1 md:mr-2" />
          음식 관리
        </button>
        <button
          @click="activeTab = 'activity'"
          :class="[
            'py-3 px-4 rounded-xl transition-all text-sm md:text-base',
            activeTab === 'activity'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <Activity :size="20" class="inline-block mr-1 md:mr-2" />
          활동 레벨
        </button>
      </div>

      <!-- 권한 관리 탭 -->
      <div
        v-if="activeTab === 'role'"
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0 }"
        class="bg-white rounded-3xl shadow-lg p-8 border-2 border-emerald-100"
      >
        <h2 class="text-gray-900 mb-6 flex items-center gap-2">
          <Users :size="24" class="text-emerald-600" />
          사용자 권한 수정
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-700 mb-2">사용자 ID</label>
            <input
              v-model="targetUserId"
              type="text"
              placeholder="권한을 변경할 사용자 ID"
              class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-700 mb-2">권한</label>
            <select
              v-model="targetRole"
              class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors bg-white"
            >
              <option value="ROLE_USER">USER</option>
              <option value="ROLE_ADMIN">ADMIN</option>
            </select>
          </div>

          <button
            @click="handleUpdateRole"
            :disabled="isUpdatingRole"
            :class="[
              'w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2',
              isUpdatingRole ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <Save :size="20" :class="{ 'animate-spin': isUpdatingRole }" />
            {{ isUpdatingRole ? '처리 중...' : '권한 변경' }}
          </button>
        </div>
      </div>

      <!-- 음식 관리 탭 -->
      <div
        v-if="activeTab === 'food'"
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0 }"
        class="space-y-6"
      >
        <!-- 음식 등록 -->
        <div class="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 overflow-hidden transition-all duration-300">
          <button 
            @click="isRegisterOpen = !isRegisterOpen"
            class="w-full flex items-center justify-between p-8 hover:bg-emerald-50/50 transition-colors"
          >
            <h2 class="text-gray-900 flex items-center gap-2">
              <Plus :size="24" class="text-emerald-600" />
              음식 등록
            </h2>
            <component :is="isRegisterOpen ? ChevronUp : ChevronDown" :size="24" class="text-gray-400" />
          </button>

          <div v-show="isRegisterOpen" class="px-8 pb-8">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-2">음식 코드 *</label>
                <input
                  v-model="newFood.code"
                  type="text"
                  placeholder="예: F001"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">음식명 *</label>
                <input
                  v-model="newFood.name"
                  type="text"
                  placeholder="예: 김치볶음밥"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">카테고리</label>
                <select
                  v-model="newFood.category"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors bg-white"
                >
                  <option value="" disabled>선택하세요</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">기준량</label>
                <input
                  v-model="newFood.standard"
                  type="text"
                  placeholder="예: 100g"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">칼로리 (kcal)</label>
                <input
                  v-model.number="newFood.kcal"
                  type="number"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">탄수화물 (g)</label>
                <input
                  v-model.number="newFood.carb"
                  type="number"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">단백질 (g)</label>
                <input
                  v-model.number="newFood.protein"
                  type="number"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">지방 (g)</label>
                <input
                  v-model.number="newFood.fat"
                  type="number"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">당류 (g)</label>
                <input
                  v-model.number="newFood.sugar"
                  type="number"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">나트륨 (g)</label>
                <input
                  v-model.number="newFood.natrium"
                  type="number"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            <button
              @click="handleAddFood"
              :disabled="isAddingFood"
              :class="[
                'w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2',
                isAddingFood ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <Plus :size="20" :class="{ 'animate-spin': isAddingFood && !newFood.code }" />
              {{ isAddingFood ? '등록 중...' : '음식 등록' }}
            </button>
          </div>
        </div>

        <!-- 음식 삭제 및 관리 -->
        <div class="bg-white rounded-3xl shadow-lg border-2 border-red-100 overflow-hidden transition-all duration-300">
          <button 
            @click="isDeleteOpen = !isDeleteOpen"
            class="w-full flex items-center justify-between p-8 hover:bg-red-50/50 transition-colors"
          >
            <h2 class="text-gray-900 flex items-center gap-2">
              <Trash2 :size="24" class="text-red-600" />
              음식 삭제 및 관리
            </h2>
            <component :is="isDeleteOpen ? ChevronUp : ChevronDown" :size="24" class="text-gray-400" />
          </button>

          <div v-show="isDeleteOpen" class="px-8 pb-8">
            <p class="text-gray-600 mb-4">음식을 검색하여 삭제하거나 관리할 수 있습니다.</p>
            <button
              @click="showSearchModal = true"
              class="w-full py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            >
              <Search :size="20" />
              음식 검색 및 관리 메뉴 열기
            </button>
          </div>
        </div>
      </div>

      <!-- 음식 검색 모달 (삭제용) -->
      <FoodSearchModal
        :is-open="showSearchModal"
        meal-time="snack"
        @close="showSearchModal = false"
        @add-food="() => {}"
      />

      <!-- 활동 레벨 관리 탭 -->
      <div
        v-if="activeTab === 'activity'"
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0 }"
        class="bg-white rounded-3xl shadow-lg p-8 border-2 border-emerald-100"
      >
        <h2 class="text-gray-900 mb-6 flex items-center gap-2">
          <Activity :size="24" class="text-emerald-600" />
          활동 레벨 관리
        </h2>

        <div class="space-y-4">
          <div
            v-for="level in activityLevels"
            :key="level.level"
            class="p-6 border-2 border-gray-200 rounded-2xl hover:border-emerald-300 transition-colors"
          >
            <!-- 수정 모드 -->
            <div v-if="editingLevel?.level === level.level" class="space-y-4">
              <div class="grid md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm text-gray-700 mb-2">레벨</label>
                  <input
                    :value="editingLevel.level"
                    type="number"
                    disabled
                    class="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-700 mb-2">가중치</label>
                  <input
                    v-model.number="editingLevel.value"
                    type="number"
                    step="0.001"
                    class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-700 mb-2">설명</label>
                  <input
                    v-model="editingLevel.description"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="handleUpdateActivityLevel"
                  class="flex-1 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Save :size="16" />
                  저장
                </button>
                <button
                  @click="editingLevel = null"
                  class="flex-1 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <X :size="16" />
                  취소
                </button>
              </div>
            </div>

            <!-- 일반 모드 -->
            <div v-else class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-4 mb-2">
                  <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                    레벨 {{ level.level }}
                  </span>
                  <span class="text-gray-700">가중치: {{ level.value }}</span>
                </div>
                <p class="text-gray-600">{{ level.description }}</p>
              </div>
              <button
                @click="editingLevel = { ...level }"
                class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <Edit2 :size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 레포트 관리 탭 -->
      <!-- 레포트 관리 탭 -->
      <div
        v-if="activeTab === 'report'"
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0 }"
        class="space-y-6"
      >
        <div class="bg-white rounded-3xl shadow-lg p-8 border-2 border-emerald-100">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-gray-900 flex items-center gap-2">
              <FileText :size="24" class="text-emerald-600" />
              전문가 분석 대기 목록
            </h2>
            <div class="text-sm text-gray-600">
              총 {{ waitingReports.length }}건 대기 중
            </div>
          </div>

          <!-- 대기 중인 레포트 없음 -->
          <div v-if="waitingReports.length === 0" class="text-center py-12">
            <FileText :size="64" class="text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">대기 중인 레포트가 없습니다.</p>
          </div>

          <!-- 대기 중인 레포트 목록 -->
          <div v-else class="space-y-4">
            <div
              v-for="report in waitingReports"
              :key="report.id"
              class="p-6 border-2 border-gray-200 rounded-2xl hover:border-emerald-300 transition-colors"
            >
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-gray-900 mb-1">
                    {{ report.userName }} ({{ report.userId }})
                  </h3>
                  <p class="text-sm text-gray-600">{{ report.createdAt }}</p>
                </div>
                <button
                  @click="handleSelectReport(report.id)"
                  class="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  분석 작성
                </button>
              </div>
              <div class="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                <div class="text-center p-3 bg-gray-50 rounded-xl">
                  <p class="text-gray-600 mb-1">칼로리</p>
                  <p class="text-gray-900">{{ report.totalKcal?.toFixed(1) }} kcal</p>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-xl">
                  <p class="text-gray-600 mb-1">탄수화물</p>
                  <p class="text-gray-900">{{ report.totalCarb?.toFixed(1) }} g</p>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-xl">
                  <p class="text-gray-600 mb-1">단백질</p>
                  <p class="text-gray-900">{{ report.totalProtein?.toFixed(1) }} g</p>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-xl">
                  <p class="text-gray-600 mb-1">지방</p>
                  <p class="text-gray-900">{{ report.totalFat?.toFixed(1) }} g</p>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-xl">
                  <p class="text-gray-600 mb-1">당류</p>
                  <p class="text-gray-900">{{ report.totalSugar?.toFixed(1) }} g</p>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-xl">
                  <p class="text-gray-600 mb-1">나트륨</p>
                  <p class="text-gray-900">{{ report.totalNatrium?.toFixed(1) }} g</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 레포트 작성 폼 (상세) -->
        <div v-if="selectedReportId" class="bg-white rounded-3xl shadow-lg p-8 border-2 border-blue-100">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-gray-900 flex items-center gap-2">
              <Edit2 :size="24" class="text-blue-600" />
              레포트 상세 분석
            </h2>
            <button
              @click="closeReportDetail"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X :size="20" />
            </button>
          </div>

          <div v-if="isLoadingDetail" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-500">상세 정보를 불러오는 중...</p>
          </div>

          <div v-else-if="reportDetail" class="space-y-8">
            <!-- 유저 정보 -->
            <div class="bg-gray-50 p-6 rounded-2xl">
               <div class="flex justify-between items-center mb-4">
                 <h3 class="font-bold text-gray-800">사용자 정보</h3>
                 <span 
                   v-if="reportDetail.userIsDiabetes"
                   class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold"
                 >
                   당뇨 환자
                 </span>
               </div>
               <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                 <div>
                   <span class="text-gray-500">성별:</span> 
                   {{ reportDetail.userGender === 'M' ? '남성' : '여성' }}
                 </div>
                 <div>
                   <span class="text-gray-500">나이:</span> {{ reportDetail.userAge }}세
                 </div>
                 <div>
                   <span class="text-gray-500">키/몸무게:</span> 
                   {{ reportDetail.userHeight }}cm / {{ reportDetail.userWeight }}kg
                 </div>
                 <div>
                   <span class="text-gray-500">활동레벨:</span> {{ reportDetail.userActivityLevel }}
                 </div>
               </div>
            </div>

            <!-- 영양 섭취 분석 (게이지 바) -->
            <div>
               <h3 class="font-bold text-gray-800 mb-4">영양 섭취 분석 (섭취량 / 권장량)</h3>
               <div class="grid md:grid-cols-2 gap-6">
                 <!-- 칼로리 -->
                 <div class="space-y-2">
                   <div class="flex justify-between text-sm">
                     <span class="font-medium text-gray-700">칼로리</span>
                     <span class="text-gray-500">
                       {{ reportDetail.totalKcal?.toFixed(0) }} / {{ reportDetail.userStdKcal?.toFixed(0) }} kcal
                     </span>
                   </div>
                   <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                       class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                       :style="{ width: Math.min((reportDetail.totalKcal / reportDetail.userStdKcal) * 100, 100) + '%' }"
                     ></div>
                   </div>
                 </div>

                 <!-- 탄수화물 -->
                 <div class="space-y-2">
                   <div class="flex justify-between text-sm">
                     <span class="font-medium text-gray-700">탄수화물</span>
                     <span class="text-gray-500">
                       {{ reportDetail.totalCarb?.toFixed(1) }} / {{ reportDetail.userStdCarb?.toFixed(1) }} g
                     </span>
                   </div>
                   <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                       class="h-full bg-blue-500 rounded-full transition-all duration-500"
                       :style="{ width: Math.min((reportDetail.totalCarb / reportDetail.userStdCarb) * 100, 100) + '%' }"
                     ></div>
                   </div>
                 </div>

                 <!-- 단백질 -->
                 <div class="space-y-2">
                   <div class="flex justify-between text-sm">
                     <span class="font-medium text-gray-700">단백질</span>
                     <span class="text-gray-500">
                       {{ reportDetail.totalProtein?.toFixed(1) }} / {{ reportDetail.userStdProtein?.toFixed(1) }} g
                     </span>
                   </div>
                   <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                       class="h-full bg-indigo-500 rounded-full transition-all duration-500"
                       :style="{ width: Math.min((reportDetail.totalProtein / reportDetail.userStdProtein) * 100, 100) + '%' }"
                     ></div>
                   </div>
                 </div>

                 <!-- 지방 -->
                 <div class="space-y-2">
                   <div class="flex justify-between text-sm">
                     <span class="font-medium text-gray-700">지방</span>
                     <span class="text-gray-500">
                       {{ reportDetail.totalFat?.toFixed(1) }} / {{ reportDetail.userStdFat?.toFixed(1) }} g
                     </span>
                   </div>
                   <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                       class="h-full bg-yellow-500 rounded-full transition-all duration-500"
                       :style="{ width: Math.min((reportDetail.totalFat / reportDetail.userStdFat) * 100, 100) + '%' }"
                     ></div>
                   </div>
                 </div>

                 <!-- 당류 -->
                 <div class="space-y-2">
                   <div class="flex justify-between text-sm">
                     <span class="font-medium text-gray-700">당류</span>
                     <span class="text-gray-500">
                       {{ reportDetail.totalSugar?.toFixed(1) }} / {{ reportDetail.userStdSugar?.toFixed(1) }} g
                     </span>
                   </div>
                   <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                       class="h-full bg-orange-500 rounded-full transition-all duration-500"
                       :style="{ width: Math.min((reportDetail.totalSugar / reportDetail.userStdSugar) * 100, 100) + '%' }"
                     ></div>
                   </div>
                 </div>

                 <!-- 나트륨 -->
                 <div class="space-y-2">
                   <div class="flex justify-between text-sm">
                     <span class="font-medium text-gray-700">나트륨</span>
                     <span class="text-gray-500">
                       {{ reportDetail.totalNatrium?.toFixed(1) }} / {{ reportDetail.userStdNatrium?.toFixed(1) }} g
                     </span>
                   </div>
                   <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                       class="h-full bg-red-500 rounded-full transition-all duration-500"
                       :style="{ width: Math.min((reportDetail.totalNatrium / reportDetail.userStdNatrium) * 100, 100) + '%' }"
                     ></div>
                   </div>
                 </div>
               </div>
            </div>

            <!-- 식단 요약 -->
            <div>
               <h3 class="font-bold text-gray-800 mb-4">식단 요약</h3>
               <div class="space-y-4">
                 <div v-for="meal in reportDetail.meals" :key="meal.id" class="border rounded-xl p-4">
                   <div class="flex justify-between items-center mb-2">
                     <span class="font-bold text-emerald-700">
                       {{ 
                         meal.mealType === 'BREAKFAST' ? '아침' : 
                         meal.mealType === 'LUNCH' ? '점심' : 
                         meal.mealType === 'DINNER' ? '저녁' : '간식' 
                       }}
                     </span>
                     <div class="text-sm text-gray-500 flex flex-wrap gap-2">
                       <span>{{ meal.totalKcal?.toFixed(0) }} kcal</span>
                       <span class="text-gray-300">|</span>
                       <span>탄: {{ meal.totalCarb?.toFixed(1) }}g</span>
                       <span class="text-gray-300">|</span>
                       <span>단: {{ meal.totalProtein?.toFixed(1) }}g</span>
                       <span class="text-gray-300">|</span>
                       <span>지: {{ meal.totalFat?.toFixed(1) }}g</span>
                       <span class="text-gray-300">|</span>
                       <span>당: {{ meal.totalSugar?.toFixed(1) }}g</span>
                       <span class="text-gray-300">|</span>
                       <span>나: {{ meal.totalNatrium?.toFixed(1) }}g</span>
                     </div>
                   </div>
                   <div class="flex flex-wrap gap-2">
                     <span 
                       v-for="food in meal.mealFoods" 
                       :key="food.id"
                       class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                     >
                       {{ food.foodName || food.userFoodName }} ({{ food.eatenWeight }}g)
                     </span>
                   </div>
                 </div>
               </div>
            </div>

            <hr class="border-gray-200" />

            <!-- 분석 입력 폼 -->
            <div class="space-y-6">
              <h3 class="font-bold text-gray-800">분석 내용 작성</h3>
              
              <div>
                <label class="block text-sm text-gray-700 mb-2">점수 (0-100)</label>
                <input
                  v-model.number="reportScore"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="점수를 입력하세요"
                  class="w-32 px-4 py-3 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">캐릭터 선택</label>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div
                    v-for="char in characters"
                    :key="char.id"
                    @click="reportCharacterId = char.id"
                    :class="[
                      'p-2 rounded-xl border-2 cursor-pointer transition-all text-center',
                      reportCharacterId === char.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    ]"
                  >
                    <img :src="char.img" alt="Character" class="w-full h-24 object-contain mb-2" />
                    <p class="text-xs font-medium">{{ char.name }}</p>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm text-gray-700 mb-2">전문가 코멘트</label>
                <textarea
                  v-model="reportComment"
                  placeholder="상세한 피드백을 작성하세요..."
                  rows="6"
                  class="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-400 resize-none"
                ></textarea>
              </div>

              <button
                @click="handleSubmitReport"
                class="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-bold text-lg"
              >
                <Save :size="24" />
                분석 완료 및 전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
