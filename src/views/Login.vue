<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/api'

const router = useRouter()
const account = ref('admin')
const password = ref('123456')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  // 重置错误信息
  errorMessage.value = ''
  
  // 表单验证
  if (!account.value || !password.value) {
    errorMessage.value = '请输入账户和密码'
    return
  }
  
  try {
    // 设置加载状态
    loading.value = true
    
    // 调用登录API
    const response = await login(account.value, password.value)
    console.log(response);
    
    // 处理登录响应
    if (response.code === 200) {
      // 登录成功，可以存储token等信息
      if (response.data) {
        localStorage.setItem('token', response.data)
      }
      
      // 跳转到仪表盘页面
      router.push('/dashboard')
    } else {
      // 登录失败，显示错误信息
      errorMessage.value = response.message || '登录失败，请检查账号密码'
    }
  } catch (error) {
    // 处理请求异常
    console.error('登录请求异常:', error)
    errorMessage.value = '网络异常，请稍后重试'
  } finally {
    // 无论成功失败，都关闭加载状态
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <svg
          class="w-10 h-10"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
            fill="#4C51BF"
            stroke="#4C51BF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
            fill="white"
          />
        </svg>
        <span class="text-2xl font-semibold text-gray-700">V-Dashboard</span>
      </div>

      <!-- 错误信息提示 -->
      <div v-if="errorMessage" class="mt-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
        {{ errorMessage }}
      </div>

      <form class="mt-4" @submit.prevent="handleLogin">
        <label class="block">
          <span class="text-sm text-gray-700">account</span>
          <input
            v-model="account"
            type="account"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          >
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input
            v-model="password"
            type="password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          >
        </label>

        <div class="flex items-center justify-between mt-4">
          <div>
            <label class="inline-flex items-center">
              <input type="checkbox" class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div>
            <a
              class="block text-sm text-indigo-700 fontme hover:underline"
              href="#"
            >Forgot your password?</a>
          </div>
        </div>

        <div class="mt-6">
          <button
            type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500 disabled:bg-indigo-300"
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
