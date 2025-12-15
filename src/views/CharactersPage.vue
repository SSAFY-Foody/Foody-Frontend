<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Sparkles } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import logoImage from '@/assets/foody_logo.png'
import foodyEggImage from '@/assets/characters/foody_egg.png'
import sproutFoodyImage from '@/assets/characters/ssassak_foody.png'
import slimanderImage from '@/assets/characters/slimander.png'
import tandanjioImage from '@/assets/characters/tandanzio.png'
import wangmaniImage from '@/assets/characters/wangmani.png'
import jammaniImage from '@/assets/characters/jammani.png'
import jjaguriImage from '@/assets/characters/jjaguri.png'
import yomaniImage from '@/assets/characters/yomani.png'
import jujeonbuoungImage from '@/assets/characters/jujeonbueong.png'
import daldaguriImage from '@/assets/characters/daldaguri.png'

interface Character {
  id: number
  name: string
  image: string
  description: string
  color: string
}

const characters: Character[] = [
  {
    id: 1,
    name: "푸디 알",
    image: foodyEggImage,
    description: "아직 태어나지 않은 푸디의 알이에요! 어떤 푸디가 태어날까요?",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: 2,
    name: "새싹 푸디",
    image: sproutFoodyImage,
    description: "아직은 아무런 맛도 모르는 아기 새싹입니다. 당신의 건강한 식단 기록으로 무럭무럭 키워주세요!",
    color: "from-yellow-400 to-orange-400",
  },
  {
    id: 3,
    name: "슬리만더",
    image: slimanderImage,
    description: "한 손엔 덤벨, 한 손엔 샐러드! 체지방 태우기를 가장 좋아하는 열정적인 다이어트 코치입니다. 저와 함께라면 목표 체중 달성은 식은 죽 먹기죠!",
    color: "from-emerald-400 to-green-500",
  },
  {
    id: 4,
    name: "탄단지오",
    image: tandanjioImage,
    description: "탄수화물, 단백질, 지방의 황금비율을 정복한 밸런스 챔피언입니다! 과하지도 부족하지도 않은 완벽한 식단으로 저와 함께 건강의 정점에 도달해보세요.",
    color: "from-green-500 to-teal-600",
  },
  {
    id: 5,
    name: "왕마니",
    image: wangmaniImage,
    description: "세상엔 맛있는 게 너무 많아! 밥그릇을 비우는 속도가 누구보다 빠른 미식가입니다. 이제 넘치는 식욕을 조금만 조절해서 '적당함'의 미학을 배워볼까요?",
    color: "from-orange-400 to-red-400",
  },
  {
    id: 6,
    name: "잠마니",
    image: jammaniImage,
    description: "아침밥보다 5분 더 자는 게 좋은 잠꾸러기입니다. 흘린 침만큼 배가 고플 텐데... 이제 무거운 이불을 걷어차고 상쾌한 아침 식사로 하루를 깨워볼까요?",
    color: "from-gray-400 to-slate-500",
  },
  {
    id: 7,
    name: "짜구리",
    image: jjaguriImage,
    description: "소금통을 마라카스처럼 흔들 때가 제일 신나! 짭조름한 맛에 취해 눈이 뱅글뱅글 돌아버린 라쿤입니다. 혀끝이 짜릿할수록 건강 적신호도 켜진다는 사실, 잊지 마세요!",
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: 8,
    name: "요마니",
    image: yomaniImage,
    description: "더도 말고 덜도 말고 딱 '요만큼'만 먹어요. 배부른 느낌이 싫어 조금씩 자주 먹는 소식가입니다. 가볍고 산뜻한 위장을 원하신다면 저를 따라오세요!",
    color: "from-amber-400 to-yellow-500",
  },
  {
    id: 9,
    name: "주전부엉",
    image: jujeonbuoungImage,
    description: "밥은 건너뛰어도 디저트는 필수! 바스락거리는 과자 봉지 소리에 반응하는 간식 사냥꾼입니다. 달콤한 유혹에 빠져 저처럼 눈이 뱅글뱅글 돌기 전에, 이제 그만 손을 멈추세요!",
    color: "from-purple-400 to-violet-500",
  },
  {
    id: 10,
    name: "달다구리",
    image: daldaguriImage,
    description: "솜사탕 머리에 젤리 팔다리, 초콜릿 복근까지! 혈관에 시럽이 흐를 것 같은 달콤함의 화신입니다. 저처럼 눈이 뱅글뱅글 돌기 전에 당류 섭취를 조금 줄여보는 건 어때요?",
    color: "from-pink-400 to-rose-500",
  },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50/40 via-emerald-50/30 to-teal-50/40">
    <Navbar />

    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Title Section -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        class="text-center mb-12"
      >
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1, transition: { delay: 200 } }"
          class="inline-flex items-center gap-2 bg-emerald-100/60 px-4 py-2 rounded-full mb-6 border border-emerald-200"
        >
          <Sparkles :size="16" class="text-emerald-600" />
          <span class="text-sm text-emerald-700">다양한 푸디 친구들</span>
        </div>

        <h1 class="text-gray-900 mb-4">캐릭터 도감</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          당신의 식단에 따라 다양한 푸디로 변신해요!<br>각 푸디는 특별한 식습관을 대표한답니다.
        </p>
      </div>

      <!-- Characters Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(character, index) in characters"
          :key="character.id"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: index * 100, duration: 500 } }"
        >
          <div
            v-motion
            :hovered="{ y: -8, scale: 1.02 }"
            class="bg-white rounded-3xl shadow-lg border-2 border-emerald-100/60 overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <!-- Character Image Container -->
            <div :class="['relative bg-gradient-to-br', character.color, 'p-8 flex items-center justify-center h-64']">
              <div
                v-motion
                :initial="{ scale: 0.8, opacity: 0 }"
                :enter="{ scale: 1, opacity: 1, transition: { delay: index * 100 + 300 } }"
                class="relative"
              >
                <img
                  v-motion
                  :initial="{ y: 0 }"
                  :enter="{
                    y: [0, -10, 0],
                    transition: {
                      duration: 2000 + index * 200,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }
                  }"
                  :src="character.image"
                  :alt="character.name"
                  class="w-48 h-48 object-contain drop-shadow-2xl"
                />
              </div>

              <!-- Character Number Badge -->
              <div class="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <span class="text-sm text-gray-700">#{{ character.id }}</span>
              </div>
            </div>

            <!-- Character Info -->
            <div class="p-6">
              <h2 class="text-gray-900 mb-3">{{ character.name }}</h2>
              <p class="text-gray-600 leading-relaxed">{{ character.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 1200 } }"
        class="mt-16 text-center"
      >
        <div class="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-12 shadow-2xl">
          <h2 class="text-white mb-4">어떤 푸디를 만나볼까요?</h2>
          <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            지금 바로 시작해서 당신만의 푸디를 키워보세요!
          </p>
          <RouterLink to="/signup">
            <button
              v-motion
              :hovered="{ scale: 1.05 }"
              :tapped="{ scale: 0.95 }"
              class="px-8 py-4 bg-white text-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow inline-flex items-center gap-2"
            >
              <span>지금 시작하기</span>
              <Sparkles :size="20" />
            </button>
          </RouterLink>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white/80 border-t border-emerald-100/50 mt-20">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-3">
            <img :src="logoImage" alt="Foody Logo" class="h-10 object-contain" />
            <span class="text-sm text-gray-500">© 2024 Foody. All rights reserved.</span>
          </div>
          <div class="flex gap-6 text-sm text-gray-600">
            <a href="#" class="hover:text-emerald-600 transition-colors">개인정보처리방침</a>
            <a href="#" class="hover:text-emerald-600 transition-colors">이용약관</a>
            <a href="#" class="hover:text-emerald-600 transition-colors">고객센터</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
