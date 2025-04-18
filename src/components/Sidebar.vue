<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '../composables/useSidebar'

const { isOpen } = useSidebar()
const activeClass = ref(
  'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100',
)
const inactiveClass = ref(
  'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
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
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
         
          <span class="mx-2 text-2xl font-semibold text-white">电池维修表</span>
        </div>
      </div>

      <nav class="mt-10">
        <!-- 保留第一个Dashboard导航项 -->
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          to="/dashboard"
        >
          <!-- 图标和文字保持不变 -->
          <span class="mx-4">电池信息表</span>
        </router-link>

        <!-- 添加第二个相同的Dashboard导航项 -->
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Dashboard1' ? activeClass : inactiveClass]"
          to="/dashboard1"
        >
          <span class="mx-4">电子保修单信息表</span>
        </router-link>

        <!-- 添加保修条例表导航项 -->
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'WarrantyRegulations' ? activeClass : inactiveClass]"
          to="/warranty-regulations"
        >
          <span class="mx-4">保修条例表</span>
        </router-link>

      </nav>
    </div>
  </div>
</template>
