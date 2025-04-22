<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '../composables/useSidebar'

const { isOpen } = useSidebar()
const activeClass = ref(
  'bg-blue-600 text-white  border-blue-400 ',
)
const inactiveClass = ref(
  'border-transparent text-gray-300 hover:bg-gray-800 hover:text-white pl-4',
)
</script>

<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
      @click="isOpen = false"
    />

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gradient-to-b from-gray-900 to-gray-800 lg:translate-x-0 lg:static lg:inset-0 shadow-lg"
    >
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <!-- 添加Logo图标 -->
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="mx-2 text-2xl font-semibold text-white">电池维修表</span>
        </div>
      </div>

      <div class="border-t border-gray-700 my-6 opacity-30"></div>

      <nav class="mt-6 px-2">
        <!-- 保留第一个Dashboard导航项 -->
        <router-link
          class="flex items-center px-4 py-3 mt-2 rounded-lg transition-all duration-200 ease-in-out"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          to="/dashboard"
        >
          <!-- 添加图标 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <span>电池信息表</span>
        </router-link>

        <!-- 添加第二个相同的Dashboard导航项 -->
        <router-link
          class="flex items-center px-4 py-3 mt-2 rounded-lg transition-all duration-200 ease-in-out"
          :class="[$route.name === 'Dashboard1' ? activeClass : inactiveClass]"
          to="/dashboard1"
        >
          <!-- 添加图标 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>电子保修单信息表</span>
        </router-link>

        <!-- 添加保修条例表导航项 -->
        <router-link
          class="flex items-center px-4 py-3 mt-2 rounded-lg transition-all duration-200 ease-in-out"
          :class="[$route.name === 'WarrantyRegulations' ? activeClass : inactiveClass]"
          to="/warranty-regulations"
        >
          <!-- 添加图标 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span>保修条例表</span>
        </router-link>
      </nav>

      <div class="absolute bottom-0 w-full p-4">
        <div class="border-t border-gray-700 pt-4 opacity-30"></div>
        <div class="flex items-center text-sm text-gray-400 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>电池管理系统 v1.0</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 添加一些过渡效果 */
.router-link-active {
  transform: translateX(4px);
}
</style>
