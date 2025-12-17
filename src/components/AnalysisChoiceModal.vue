<script setup lang="ts">
import { X, Bot, User as UserIcon } from 'lucide-vue-next'

interface Emits {
  (e: 'close'): void
  (e: 'choose-ai'): void
  (e: 'choose-expert'): void
}

const emit = defineEmits<Emits>()
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
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        @click="emit('close')"
      ></div>
    </Transition>

    <div class="fixed inset-0 flex items-center justify-center z-50 p-4" @click="emit('close')">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-90 translate-y-8"
        leave-to-class="opacity-0 scale-90 translate-y-8"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-5 flex items-center justify-between">
            <h2 class="text-white">식단 분석 방식 선택</h2>
            <button
              @click="emit('close')"
              class="w-8 h-8 bg-white/20 hover:bg-white/30 hover:scale-110 hover:rotate-90 active:scale-90 rounded-full flex items-center justify-center transition-all"
            >
              <X :size="20" class="text-white" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-8">
            <p class="text-gray-600 text-center mb-8">
              어떤 방식으로 식단을 분석하시겠어요?
            </p>

            <div class="grid md:grid-cols-2 gap-6">
              <!-- AI 분석 -->
              <button
                @click="emit('choose-ai')"
                class="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200 hover:border-emerald-400 hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
              >
                <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                
                <div class="relative">
                  <div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <Bot :size="40" class="text-white" />
                  </div>
                  
                  <h3 class="text-gray-900 mb-2">AI 분석</h3>
                  <p class="text-sm text-gray-600 mb-4">
                    즉시 분석 결과를 확인하세요
                  </p>
                  
                  <div class="flex items-center justify-center gap-2 text-emerald-600">
                    <span class="px-2 py-1 bg-emerald-100 rounded-full text-xs">즉시 분석</span>
                  </div>
                </div>
              </button>

              <!-- 전문가 분석 -->
              <button
                @click="emit('choose-expert')"
                class="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
              >
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                
                <div class="relative">
                  <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <UserIcon :size="40" class="text-white" />
                  </div>
                  
                  <h3 class="text-gray-900 mb-2">전문가 분석</h3>
                  <p class="text-sm text-gray-600 mb-4">
                    영양 전문가의 상세한 피드백
                  </p>
                  
                  <div class="flex items-center justify-center gap-2 text-blue-600">
                    <span class="px-2 py-1 bg-blue-100 rounded-full text-xs">1-2일 소요</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

