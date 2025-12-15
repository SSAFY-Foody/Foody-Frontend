<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-3xl text-gray-900 mb-4">음식 검색</h1>
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <input
          type="text"
          placeholder="음식을 검색하세요..."
          class="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400"
        />
        <p class="text-gray-500 mt-4 text-center">검색 기능 (구현 예정)</p>
      </div>
    </main>
  </div>
</template>
