<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import animation1 from '@/assets/animation/analyze_animation1.png'
import animation2 from '@/assets/animation/analyze_animation2.png'
import animation3 from '@/assets/animation/analyze_animation3.png'
import animation4 from '@/assets/animation/analyze_animation4.png'
import animation5 from '@/assets/animation/analyze_animation5.png'
import animation6 from '@/assets/animation/analyze_animation6.png'
import animation7 from '@/assets/animation/analyze_animation7.png'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const ANIMATION_SEQUENCE = [
  { image: animation1, duration: 500, text: '푸디가 식단을 확인하고 있어요...' },
  { image: animation2, duration: 500, text: '영양소를 분석 중이에요...' },
  { image: animation3, duration: 500, text: '푸디가 맛있게 먹고 있어요...' },
  { image: animation4, duration: 500, text: '건강한 식습관을 확인 중...' },
  { image: animation5, duration: 500, text: '거의 다 됐어요...' },
  { image: animation6, duration: 500, text: '마지막 분석 중...' },
]

const LOADING_IMAGE = { image: animation7, duration: 1000, text: '분석을 완료하고 있어요...' }

const currentStep = ref(0)
const isLooping = ref(false)
let timer: NodeJS.Timeout | null = null

const currentAnimation = computed(() => {
  return isLooping.value 
    ? LOADING_IMAGE 
    : (ANIMATION_SEQUENCE[currentStep.value] || ANIMATION_SEQUENCE[0])
})

const progressWidth = computed(() => {
  if (isLooping.value) return '95%'
  return `${((currentStep.value + 1) / ANIMATION_SEQUENCE.length) * 90}%`
})

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    currentStep.value = 0
    isLooping.value = false
    if (timer) clearTimeout(timer)
    return
  }

  runAnimation()
})

const runAnimation = () => {
  if (!props.isOpen) return

  if (currentStep.value < ANIMATION_SEQUENCE.length) {
    timer = setTimeout(() => {
      currentStep.value++
      runAnimation()
    }, ANIMATION_SEQUENCE[currentStep.value].duration)
  } else {
    isLooping.value = true
  }
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
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
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition-all duration-200"
      leave-active-class="transition-all duration-200"
      enter-from-class="opacity-0 scale-90"
      leave-to-class="opacity-0 scale-90"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
          <!-- 푸디 애니메이션 -->
          <div class="relative mb-6 flex justify-center">
            <img
              :src="currentAnimation.image"
              alt="푸디 분석 중"
              :class="[
                'w-64 h-64 object-contain',
                isLooping ? 'animate-shake' : ''
              ]"
            />
          </div>

          <!-- 텍스트 -->
          <div class="text-center">
            <h3 class="text-gray-900 mb-2">AI 식단 분석</h3>
            <p class="text-gray-600">{{ currentAnimation.text }}</p>
          </div>

          <!-- Progress Bar -->
          <div class="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500"
              :style="{ width: progressWidth }"
            ></div>
          </div>

          <!-- Loading dots -->
          <div class="flex justify-center gap-2 mt-6">
            <div
              v-for="i in 3"
              :key="i"
              class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
              :style="{ animationDelay: `${(i - 1) * 200}ms` }"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 흔들림 애니메이션 - 7번 이미지용 */
@keyframes shake {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-10px) rotate(-5deg);
  }
}

.animate-shake {
  animation: shake 2s ease-in-out infinite;
}
</style>
