<template>
  <div class="w-full">

    <!-- 标题和按钮区域 -->
    <div class="mt-4 flex w-full justify-between items-center">
      <h3 class="text-3xl font-medium text-gray-700">
        电池信息表
      </h3>
      <div class="flex space-x-4">
        <!-- Excel导入功能 -->
        <div class="relative">
          <label for="fileUpload"
            class="cursor-pointer px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12" />
            </svg>
            导入Excel
          </label>
          <input id="fileUpload" type="file" @change="handleFileUpload" accept=".xlsx, .xls" class="hidden">
        </div>

        <!-- 添加电池按钮 -->
        <button @click="showAddModal = true"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          添加电池
        </button>
      </div>
    </div>

    <div class="flex flex-col mt-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table class="min-w-full" id="printTable">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  出厂编号
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  产品名称
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  产品型号
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  出厂日期
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  二维码
                </th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(b, index) in batteries" :key="index">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ b.factoryNumber }}
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ b.productName }}
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ b.productModel }}
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ b.productionDate }}
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <vue-qrcode value="https://www.1stg.me" width="100"></vue-qrcode>
                </td>

                <td
                  class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <button class="text-indigo-600 hover:text-indigo-900">打印</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="flex justify-center mt-6">
      <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total"
        layout="prev, pager, next, total" @current-change="handlePageChange" />
    </div>

    <!-- 添加电池的模态框 -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-1/2">
        <h3 class="text-xl font-medium mb-4">添加电池</h3>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productName">
            产品名称 <span class="text-red-500">*</span>
          </label>
          <input id="productName" v-model="newBattery.productName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text" placeholder="请输入产品名称" required>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productModel">
            产品型号 <span class="text-red-500">*</span>
          </label>
          <input id="productModel" v-model="newBattery.productModel"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text" placeholder="请输入产品型号" required>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productionDate">
            出厂日期 <span class="text-red-500">*</span>
          </label>
          <input id="productionDate" v-model="newBattery.productionDate"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="date" required>
        </div>

        <div class="flex justify-end">
          <button @click="cancelAdd"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
            取消
          </button>
          <button @click="addBattery" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import VueQrcode from 'vue-qrcode'
import * as XLSX from 'xlsx'
import { ElPagination, ElMessage } from 'element-plus'
import { addBattery as addBatteryApi, getBatteryList, addBatteries } from '../api/api'

interface Battery {
  factoryNumber: string
  productName: string
  productModel: string
  productionDate: string
}

// 电池数据列表
const batteries = ref<Battery[]>([])
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

// 获取电池列表数据
const fetchBatteryList = async () => {
  try {
    loading.value = true
    // 调用API时传递三个分页参数
    const response = await getBatteryList({ pageNum: currentPage.value, pageSize: pageSize.value })
    if (response.code === 200) {
      // 假设后端返回的数据结构包含 list 和 total
      if (response.data) {
        batteries.value = response.data.data
        total.value = response.data.total
      } else {
        batteries.value = response.data || []
        total.value = batteries.value.length
      }
    } else {
      ElMessage.error(response.message || '获取电池列表失败')
      // 如果API不可用，使用测试数据
      useMockData()
    }
  } catch (error) {
    console.error('获取电池列表失败:', error)
    // 如果API不可用，使用测试数据
    useMockData()
  } finally {
    loading.value = false
  }
}

// 使用测试数据（当API不可用时）
const useMockData = () => {
  const testBattery: Battery = {
    factoryNumber: 'SN123456789',
    productName: '高性能电池',
    productModel: 'Model-X',
    productionDate: '2023-10-01'
  }

  batteries.value = [...Array(16).keys()].map(() => ({
    ...testBattery,
    factoryNumber: `SN123456789-${Math.floor(Math.random() * 1000)}`
  }))
  total.value = batteries.value.length
}

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  console.log('页码变化:', currentPage.value);
  
  // 页码变化时重新获取数据
  fetchBatteryList()
}

// 监听页码和每页数量变化，重新获取数据
watch([currentPage, pageSize], () => {
  fetchBatteryList()
})

// 添加电池相关的状态和方法
const showAddModal = ref(false)
const newBattery = ref<Battery>({
  factoryNumber: '',
  productName: '',
  productModel: '',
  productionDate: ''
})

// 取消添加
const cancelAdd = () => {
  showAddModal.value = false
  resetNewBattery()
}

// 重置新电池数据
const resetNewBattery = () => {
  newBattery.value = {
    factoryNumber: '',
    productName: '',
    productModel: '',
    productionDate: ''
  }
}

// 添加电池
const addBattery = async () => {
  // 验证必填字段
  if (!newBattery.value.productName || !newBattery.value.productModel || !newBattery.value.productionDate) {
    ElMessage.warning('产品名称、产品型号和出厂日期为必填项！')
    return
  }

  try {
    // 自动生成序列号
    const batteryData = {
      ...newBattery.value,
    }
    // 调用添加电池API
    const response = await addBatteryApi(batteryData)
    if (response.code === 200) {
      ElMessage.success('添加电池成功')

      // 关闭模态框并重置表单
      showAddModal.value = false
      resetNewBattery()

      // 添加新数据后返回第一页并重新获取数据
      currentPage.value = 1
      fetchBatteryList()
    } else {
      ElMessage.error(response.message || '添加电池失败')

      // 如果API失败，仍然添加到本地列表（仅用于演示）
      batteries.value.unshift(batteryData)
      showAddModal.value = false
      resetNewBattery()
    }
  } catch (error) {
    console.error('添加电池失败:', error)
  }
}

// 添加Excel文件上传处理函数
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // 将解析后的数据转换为 Battery 类型
        const parsedBatteries = jsonData.map((item: any) => ({
          factoryNumber: item['出厂编号'] || `SN${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          productName: item['产品名称'] || '',
          productModel: item['产品型号'] || '',
          productionDate: item['出厂日期'] || ''
        }));
        //上传到服务器
        console.log(parsedBatteries);
        
        const res = await addBatteries(parsedBatteries);
        if (res.code == 200) {
          ElMessage.success(res.message)
          currentPage.value = 1
          fetchBatteryList()
        }
        // 替换现有数据


        ElMessage.success(`成功导入 ${parsedBatteries.length} 条数据`)
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

// 页面加载时获取电池列表
onMounted(() => {
  fetchBatteryList()
})
</script>