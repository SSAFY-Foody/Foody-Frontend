<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-3xl text-gray-900 mb-4">식단 분석</h1>
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <p class="text-gray-600 mb-4">AI가 당신의 식단을 분석합니다</p>
        <button class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl">
          분석 시작
        </button>
      </div>
    </main>
  </div>
</template>
