<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, Mail, Calendar, Ruler, Weight, Activity,
  Edit2, Save, X, ChevronRight, FileText, ChevronLeft, Trash2, Lock, Eye, EyeOff
} from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

// Mock 데이터
const mockUserData = {
  username: 'foody_lover',
  name: '김푸디',
  email: 'foody@example.com',
  age: 25,
  height: 170,
  weight: 65,
  gender: 'female' as 'male' | 'female',
  activityLevel: '3',
  hasDiabetes: false,
  joinDate: '2024-01-15'
}

const mockAnalysisReports = [
  { id: '1', date: '2024-12-14', score: 85, characterName: '건강 푸디', comment: '훌륭한 식습관이에요! 균형잡힌 식단입니다.' },
  { id: '2', date: '2024-12-13', score: 78, characterName: '균형 푸디', comment: '좋은 식습관을 유지하고 있어요!' },
  { id: '3', date: '2024-12-10', score: 92, characterName: '완벽 푸디', comment: '완벽한 영양 균형이에요! 정말 훌륭합니다.' },
  { id: '4', date: '2024-12-08', score: 73, characterName: '노력 푸디', comment: '조금씩 나아지고 있어요. 계속 파이팅!' },
  { id: '5', date: '2024-12-05', score: 88, characterName: '건강 푸디', comment: '단백질 섭취가 아주 좋아요!' },
  { id: '6', date: '2024-12-03', score: 81, characterName: '균형 푸디', comment: '탄수화물과 단백질 비율이 좋네요.' },
  { id: '7', date: '2024-11-30', score: 76, characterName: '노력 푸디', comment: '식습관이 개선되고 있어요.' },
  { id: '8', date: '2024-11-28', score: 90, characterName: '건강 푸디', comment: '완벽한 하루였어요!' },
]

const activityLevelNames = {
  '1': '거의 활동 없음',
  '2': '가벼운 활동',
  '3': '보통 활동',
  '4': '활발한 활동',
  '5': '매우 활발함'
}

const activeTab = ref<'info' | 'reports'>('reports')
const isEditing = ref(false)
const editedData = ref({ ...mockUserData })
const reports = ref([...mockAnalysisReports])

// 비밀번호 변경
const isChangingPassword = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// 날짜 필터 및 페이지네이션
const startDate = ref('')
const endDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

const filteredReports = computed(() => {
  return reports.value.filter((report) => {
    const reportDate = new Date(report.date)
    const start = startDate.value ? new Date(startDate.value) : null
    const end = endDate.value ? new Date(endDate.value) : null
    if (start && reportDate < start) return false
    if (end && reportDate > end) return false
    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredReports.value.length / itemsPerPage)))

const currentReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredReports.value.slice(start, end)
})

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleResetFilter = () => {
  startDate.value = ''
  endDate.value = ''
  currentPage.value = 1
}

const handleDeleteReport = (reportId: string, e: Event) => {
  e.stopPropagation()
  
  if (window.confirm('이 레포트를 삭제하시겠습니까?')) {
    reports.value = reports.value.filter(report => report.id !== reportId)
    
    // 삭제 후 페이지 조정
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  }
}

const handleSave = () => {
  console.log('Updated user data:', editedData.value)
  isEditing.value = false
}

const handleCancel = () => {
  editedData.value = { ...mockUserData }
  isEditing.value = false
}

const handleDeleteAccount = () => {
  if (window.confirm('정말로 회원탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    if (window.confirm('모든 데이터가 삭제됩니다. 정말 탈퇴하시겠습니까?')) {
      // TODO: 실제 회원탈퇴 API 호출
      localStorage.removeItem('isLoggedIn')
      alert('회원탈퇴가 완료되었습니다.')
      router.push('/')
    }
  }
}

const handleChangePassword = () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    alert('모든 필드를 입력해주세요.')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    alert('새 비밀번호가 일치하지 않습니다.')
    return
  }
  if (newPassword.value.length < 8) {
    alert('비밀번호는 8자 이상이어야 합니다.')
    return
  }
  alert('비밀번호가 변경되었습니다.')
  isChangingPassword.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
    <Navbar />

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 탭 네비게이션 -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        class="bg-white rounded-2xl shadow-md p-2 mb-8 flex gap-2"
      >
        <button
          @click="activeTab = 'info'"
          :class="[
            'flex-1 py-3 px-6 rounded-xl transition-all',
            activeTab === 'info'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <User :size="20" class="inline-block mr-2" />
          내 정보
        </button>
        <button
          @click="activeTab = 'reports'"
          :class="[
            'flex-1 py-3 px-6 rounded-xl transition-all',
            activeTab === 'reports'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <FileText :size="20" class="inline-block mr-2" />
          분석 레포트
        </button>
      </div>

      <!-- 내 정보 탭 -->
      <div
        v-if="activeTab === 'info'"
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0 }"
        class="space-y-6"
      >
        <!-- 프로필 카드 -->
        <div class="bg-white rounded-3xl shadow-lg p-8 border-2 border-emerald-100">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-gray-900 flex items-center gap-2">
              <User :size="24" class="text-emerald-600" />
              계정 정보
            </h2>
            <button
              v-if="!isEditing"
              @click="isEditing = true"
              class="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              <Edit2 :size="16" />
              수정
            </button>
            <div v-else class="flex gap-2">
              <button
                @click="handleSave"
                class="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
              >
                <Save :size="16" />
                저장
              </button>
              <button
                @click="handleCancel"
                class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X :size="16" />
                취소
              </button>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- 아이디 -->
            <div class="space-y-2">
              <label class="text-sm text-gray-600 flex items-center gap-2">
                <User :size="16" />
                아이디
              </label>
              <input
                type="text"
                :value="editedData.username"
                disabled
                class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700"
              />
            </div>

            <!-- 이름 -->
            <div class="space-y-2">
              <label class="text-sm text-gray-600 flex items-center gap-2">
                <User :size="16" />
                이름
              </label>
              <input
                v-model="editedData.name"
                type="text"
                :disabled="!isEditing"
                :class="[
                  'w-full px-4 py-3 border-2 rounded-xl transition-colors',
                  isEditing
                    ? 'border-emerald-100 focus:border-emerald-400 focus:outline-none'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                ]"
              />
            </div>

            <!-- 이메일 -->
            <div class="space-y-2">
              <label class="text-sm text-gray-600 flex items-center gap-2">
                <Mail :size="16" />
                이메일
              </label>
              <input
                v-model="editedData.email"
                type="email"
                :disabled="!isEditing"
                :class="[
                  'w-full px-4 py-3 border-2 rounded-xl transition-colors',
                  isEditing
                    ? 'border-emerald-100 focus:border-emerald-400 focus:outline-none'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                ]"
              />
            </div>

            <!-- 나이 -->
            <div class="space-y-2">
              <label class="text-sm text-gray-600 flex items-center gap-2">
                <Calendar :size="16" />
                나이
              </label>
              <div class="relative">
                <input
                  v-model.number="editedData.age"
                  type="number"
                  :disabled="!isEditing"
                  :class="[
                    'w-full px-4 py-3 border-2 rounded-xl transition-colors',
                    isEditing
                      ? 'border-emerald-100 focus:border-emerald-400 focus:outline-none'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  ]"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">세</span>
              </div>
            </div>

            <!-- 키 -->
            <div class="space-y-2">
              <label class="text-sm text-gray-600 flex items-center gap-2">
                <Ruler :size="16" />
                키
              </label>
              <div class="relative">
                <input
                  v-model.number="editedData.height"
                  type="number"
                  :disabled="!isEditing"
                  :class="[
                    'w-full px-4 py-3 border-2 rounded-xl transition-colors',
                    isEditing
                      ? 'border-emerald-100 focus:border-emerald-400 focus:outline-none'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  ]"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">cm</span>
              </div>
            </div>

            <!-- 몸무게 -->
            <div class="space-y-2">
              <label class="text-sm text-gray-600 flex items-center gap-2">
                <Weight :size="16" />
                몸무게
              </label>
              <div class="relative">
                <input
                  v-model.number="editedData.weight"
                  type="number"
                  :disabled="!isEditing"
                  :class="[
                    'w-full px-4 py-3 border-2 rounded-xl transition-colors',
                    isEditing
                      ? 'border-emerald-100 focus:border-emerald-400 focus:outline-none'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  ]"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
              </div>
            </div>

            <!-- 활동량 -->
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-gray-600 flex items-center gap-2">
                <Activity :size="16" />
                활동량
              </label>
              <select
                v-if="isEditing"
                v-model="editedData.activityLevel"
                class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="1">1 - 거의 활동 없음 (주로 앉아서 생활)</option>
                <option value="2">2 - 가벼운 활동 (주 1-2회 운동)</option>
                <option value="3">3 - 보통 활동 (주 3-4회 운동)</option>
                <option value="4">4 - 활발한 활동 (주 5-6회 운동)</option>
                <option value="5">5 - 매우 활발함 (매일 격한 운동)</option>
              </select>
              <input
                v-else
                type="text"
                :value="`${editedData.activityLevel} - ${activityLevelNames[editedData.activityLevel as keyof typeof activityLevelNames]}`"
                disabled
                class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700"
              />
            </div>

            <!-- 당뇨 여부 -->
            <div class="md:col-span-2">
              <label
                :class="[
                  'flex items-center gap-3 cursor-pointer p-4 rounded-xl transition-colors',
                  isEditing ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'bg-gray-50'
                ]"
              >
                <input
                  v-model="editedData.hasDiabetes"
                  type="checkbox"
                  :disabled="!isEditing"
                  :class="[
                    'w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500',
                    isEditing ? 'cursor-pointer' : 'cursor-not-allowed'
                  ]"
                />
                <span class="text-gray-700">당뇨병이 있습니다</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 비밀번호 변경 카드 -->
        <div class="bg-white rounded-3xl shadow-lg p-8 border-2 border-emerald-100">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-gray-900 flex items-center gap-2">
              <Lock :size="24" class="text-emerald-600" />
              비밀번호 변경
            </h2>
            <button
              v-if="!isChangingPassword"
              @click="isChangingPassword = true"
              class="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              변경하기
            </button>
          </div>

          <div v-if="isChangingPassword" class="space-y-4">
            <!-- 현재 비밀번호 -->
            <div class="space-y-2">
              <label class="text-sm text-gray-600">현재 비밀번호</label>
              <div class="relative">
                <input
                  v-model="currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  placeholder="현재 비밀번호를 입력하세요"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors pr-12"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeOff v-if="showCurrentPassword" :size="20" />
                  <Eye v-else :size="20" />
                </button>
              </div>
            </div>

            <!-- 새 비밀번호 -->
            <div class="space-y-2">
              <label class="text-sm text-gray-600">새 비밀번호</label>
              <div class="relative">
                <input
                  v-model="newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="새 비밀번호를 입력하세요"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors pr-12"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeOff v-if="showNewPassword" :size="20" />
                  <Eye v-else :size="20" />
                </button>
              </div>
            </div>

            <!-- 새 비밀번호 확인 -->
            <div class="space-y-2">
              <label class="text-sm text-gray-600">새 비밀번호 확인</label>
              <div class="relative">
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors pr-12"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeOff v-if="showConfirmPassword" :size="20" />
                  <Eye v-else :size="20" />
                </button>
              </div>
            </div>

            <!-- 버튼 -->
            <div class="flex gap-3 pt-4">
              <button
                @click="() => {
                  isChangingPassword = false
                  currentPassword = ''
                  newPassword = ''
                  confirmPassword = ''
                }"
                class="flex-1 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                취소
              </button>
              <button
                @click="handleChangePassword"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                변경하기
              </button>
            </div>
          </div>
          <p v-else class="text-gray-600">비밀번호를 안전하게 관리하세요.</p>
        </div>

        <!-- 회원탈퇴 버튼 -->
        <button
          @click="handleDeleteAccount"
          class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors border-2 border-red-200"
        >
          <User :size="20" />
          회원탈퇴
        </button>
      </div>

      <!-- 분석 레포트 탭 -->
      <div
        v-if="activeTab === 'reports'"
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0 }"
        class="bg-white rounded-3xl shadow-lg p-8"
      >
        <h2 class="text-gray-900 flex items-center gap-2 mb-6">
          <FileText :size="24" class="text-emerald-600" />
          영양 분석 레포트
        </h2>

        <div class="space-y-4">
          <!-- 필터링 및 페이지네이션 -->
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
            <div class="flex flex-wrap items-center gap-2">
              <label class="text-sm text-gray-600">기간 필터링:</label>
              <input
                v-model="startDate"
                type="date"
                class="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <span class="text-gray-500">~</span>
              <input
                v-model="endDate"
                type="date"
                class="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <button
                @click="handleResetFilter"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                초기화
              </button>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">페이지:</span>
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage === 1"
                :class="[
                  'px-4 py-2 bg-gray-100 text-gray-700 rounded-xl transition-colors',
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                ]"
              >
                <ChevronLeft :size="16" />
              </button>
              <span class="text-sm text-gray-700">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage === totalPages"
                :class="[
                  'px-4 py-2 bg-gray-100 text-gray-700 rounded-xl transition-colors',
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                ]"
              >
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>

          <!-- 레포트 목록 -->
          <div
            v-for="report in currentReports"
            :key="report.id"
            v-motion
            :hovered="{ scale: 1.02 }"
            @click="router.push('/analyze/result')"
            class="border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-300 transition-all cursor-pointer relative group"
          >
            <!-- 삭제 버튼 -->
            <button
              @click="(e) => handleDeleteReport(report.id, e)"
              class="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 z-10"
              aria-label="레포트 삭제"
            >
              <Trash2 :size="20" />
            </button>

            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <h3 class="text-gray-900">{{ new Date(report.date).toLocaleDateString() }}</h3>
                  <div class="px-4 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-sm">
                    {{ report.score }}점
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <span class="text-2xl">🌱</span>
                    <span>{{ report.characterName }}</span>
                  </div>
                  <p class="text-gray-700 bg-emerald-50 rounded-xl p-3 text-sm">
                    💬 {{ report.comment }}
                  </p>
                </div>
              </div>
              <ChevronRight :size="24" class="text-gray-400 flex-shrink-0 ml-4" />
            </div>
          </div>

          <!-- 빈 상태 -->
          <div v-if="currentReports.length === 0" class="text-center py-12">
            <FileText :size="64" class="text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500 mb-2">{{ filteredReports.length === 0 ? '검색 결과가 없습니다.' : '레포트가 없습니다.' }}</p>
            <button
              v-if="filteredReports.length === 0 && (startDate || endDate)"
              @click="handleResetFilter"
              class="mt-4 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
