<template>
  <div class="w-full">

    <!-- 标题和按钮区域 -->
    <div class="mt-4 flex w-full justify-between items-center">
      <div class="flex items-center">
        <h3 class="text-3xl font-medium text-gray-700">
          电池信息表
        </h3>
        <!-- 添加搜索框 -->
        <div class="relative mx-4 lg:ml-30 ml-6">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>

          <input v-model="searchKey"
            class="w-32 pl-10 pr-4 text-indigo-600 border-gray-200 rounded-md sm:w-64 focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            type="text" placeholder="搜索电池信息" @input="handleSearch">
        </div>
      </div>
      <div class="flex space-x-4">
        <!-- Excel导出模板功能 -->
        <button @click="exportExcelTemplate"
          class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出模板
        </button>


        <!-- 批量导出二维码功能 -->
        <button @click="exportQRCodesToPDF"
          class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          导出二维码
        </button>

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

        <button @click="handleAddSameBattery"
          class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          批量导入相同的电池
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

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap" b>
                  {{ b.productionDate }}
                </td>

                <td class=" py-4 border-b border-gray-200 whitespace-nowrap">
                  <vue-qrcode :value="`http://www.ldlyj.cn/battery/${b.id}`" width="100"></vue-qrcode>
                </td>

                <td
                  class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <div class="flex space-x-2 justify-end">
                    <button @click="handleEdit(b)" class="text-blue-600 hover:text-blue-900">编辑</button>
                    <button @click="handlePrint(b)" class="text-indigo-600 hover:text-indigo-900">打印</button>
                    <button @click="handleDelete(b.id!)" class="text-red-600 hover:text-red-900">删除</button>
                  </div>
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

    <!-- 添加/编辑电池的模态框 -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-1/2">
        <h3 class="text-xl font-medium mb-4">{{ isEditMode ? '编辑电池' : '添加电池' }}</h3>

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
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productModel">
            质保年限 <span class="text-red-500">*</span>
          </label>
          <input id="productModel" v-model="newBattery.warrantyPeriod"
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

        <div class="mb-4" v-if="isShowCount">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productionDate">
            数量 <span class="text-red-500">*</span>
          </label>
          <input id="productModel" v-model="count"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text" placeholder="请输入电池数量" required>
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

  <!-- 打印预览模态框 -->
  <div v-if="showPrintModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-1/3">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-medium">打印预览</h3>
        <button @click="closePrintModal" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 打印内容 -->
      <div id="printContent" class="print-container">
        <div class="qrcode-img flex justify-center ">
          <vue-qrcode v-if="currentPrintBattery" :value="`http://www.ldlyj.cn/battery/${currentPrintBattery.id}`"
            :width="200"></vue-qrcode>
        </div>
        <div v-if="currentPrintBattery" class="factory-number text-center">{{ currentPrintBattery.factoryNumber }}</div>
      </div>

      <div class="flex justify-end mt-4">
        <button @click="closePrintModal"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
          取消
        </button>
        <button @click="printBattery" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          打印
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import VueQrcode from 'vue-qrcode'
import qrcode from "qrcode";
import * as XLSX from 'xlsx'
import { ElPagination, ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { addBattery as addBatteryApi, getBatteryList, addBatteries, deleteBatteryById, updateBattery, addSameBatteries } from '../api/api'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface Battery {
  id?: number
  factoryNumber: string
  productName: string
  productModel: string
  productionDate: string
  warrantyPeriod?: number
}

// 电池数据列表
const batteries = ref<Battery[]>([])
const loading = ref(false)

// 添加搜索关键字
const searchKey = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(100)
const total = ref(0)

// 搜索处理函数
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
  fetchBatteryList() // 重新获取数据
}

// 处理批量导入相同的电池
const handleAddSameBattery = () => {
  // 弹出文件选择对话框
  showAddModal.value = true
  isShowCount.value = true
}

// 获取电池列表数据
const fetchBatteryList = async () => {
  try {
    loading.value = true
    // 调用API时传递分页参数和搜索关键字
    const response = await getBatteryList({
      pageParam: {
        pageNum: currentPage.value,
        pageSize: pageSize.value
      },
      key: searchKey.value
    })
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
    id: 0,
    factoryNumber: 'SN123456789',
    productName: '高性能电池',
    productModel: 'Model-X',
    productionDate: '2023-10-01',
    warrantyPeriod: 2
  }

  batteries.value = [...Array(16).keys()].map((i) => ({
    ...testBattery,
    id: i + 1,
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

// 添加/编辑电池相关的状态和方法
const showAddModal = ref(false)
const isShowCount = ref(false)
const count = ref(0)
const isEditMode = ref(false)
const newBattery = ref<Battery>({
  factoryNumber: '',
  productName: '',
  productModel: '',
  productionDate: ''
})

// 取消添加/编辑
const cancelAdd = () => {
  showAddModal.value = false
  resetNewBattery()
  isEditMode.value = false
  isShowCount.value = false
}

// 处理编辑电池
const handleEdit = (battery: Battery) => {
  isEditMode.value = true
  newBattery.value = { ...battery }
  showAddModal.value = true
}

// 处理删除电池
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除这个电池吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      loading.value = true
      const response = await deleteBatteryById(id)

      if (response.code === 200) {
        ElMessage.success('删除成功')
        // 删除后重新获取数据
        fetchBatteryList()
      } else {
        ElMessage.error(response.message || '删除失败')
      }
    } catch (error) {
      console.error('删除电池失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }).catch(() => {
    // 用户取消删除操作
    ElMessage.info('已取消删除')
  })
}

// 重置新电池数据
const resetNewBattery = () => {
  newBattery.value = {
    factoryNumber: '',
    productName: '',
    productModel: '',
    productionDate: '',
  }
  isEditMode.value = false
}

// 添加/更新电池
const addBattery = async () => {
  // 验证必填字段
  if (!newBattery.value.productName || !newBattery.value.productModel || !newBattery.value.productionDate) {
    ElMessage.warning('产品名称、产品型号和出厂日期为必填项！')
    return
  }

  try {
    const batteryData = {
      ...newBattery.value,
      status: 1
    }

    let response
    if (isEditMode.value) {
      // 调用更新电池API
      // const someBatteries = [] as Battery[]
      // for (let i = 0; i < count.value; i++) {
      //   someBatteries.push(batteryData)
      // }

      response = await updateBattery(batteryData)
    } else if(count.value > 0 && isShowCount.value){
      
      response = await addSameBatteries(count.value, batteryData)
    } 
    else {
      // 调用添加电池API
      response = await addBatteryApi(batteryData)
    }

    if (response.code === 200) {
      ElMessage.success(isEditMode.value ? '更新电池成功' : '添加电池成功')

      // 关闭模态框并重置表单
      showAddModal.value = false
      resetNewBattery()
      isEditMode.value = false

      // 更新数据后重新获取数据
      fetchBatteryList()
    } else {
      ElMessage.error(response.message || (isEditMode.value ? '更新电池失败' : '添加电池失败'))

      // 如果API失败，仍然添加到本地列表（仅用于演示）
      if (!isEditMode.value) {
        batteries.value.unshift(batteryData)
      }
      showAddModal.value = false
      resetNewBattery()
      isEditMode.value = false
    }
  } catch (error) {
    console.error(isEditMode.value ? '更新电池失败:' : '添加电池失败:', error)
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
        const parsedBatteries = jsonData.map((item: any) => {
          // 处理日期格式
          let productionDate = item['出厂日期'] || '';

          // 如果日期是Excel日期数值格式，转换为yyyy-MM-dd格式
          if (productionDate && typeof productionDate === 'number') {
            const excelDate = new Date(Math.floor((productionDate - 25569) * 86400 * 1000));
            productionDate = formatDate(excelDate);
          } else if (productionDate instanceof Date) {
            productionDate = formatDate(productionDate);
          } else if (typeof productionDate === 'string') {
            // 尝试解析字符串日期并格式化
            const dateObj = new Date(productionDate);
            if (!isNaN(dateObj.getTime())) {
              productionDate = formatDate(dateObj);
            }
          }

          return {
            factoryNumber: item['出厂编号'] || `SN${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            productName: item['产品名称'] || '',
            productModel: item['产品型号'] || '',
            productionDate: productionDate
          };
        });

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

// 格式化日期为yyyy-MM-dd格式
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 导出Excel模板功能
const exportExcelTemplate = () => {
  // 创建一个新的工作簿
  const workbook = XLSX.utils.book_new();

  // 创建表头数据
  const headers = [['产品名称', '产品型号', '出厂日期']];

  // 创建工作表
  const worksheet = XLSX.utils.aoa_to_sheet(headers);

  // 设置列宽
  const colWidths = [{ wch: 20 }, { wch: 20 }, { wch: 15 }];
  worksheet['!cols'] = colWidths;

  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, '电池信息模板');

  // 导出Excel文件
  XLSX.writeFile(workbook, '电池信息导入模板.xlsx');

  // 提示用户
  ElMessage.success('模板已导出，请填写后导入');
};

// 打印预览模态框状态
const showPrintModal = ref(false)
const currentPrintBattery = ref<Battery | null>(null)

// 处理打印功能
const handlePrint = (battery) => {
  // 设置当前要打印的电池信息
  currentPrintBattery.value = battery
  // 显示打印预览模态框
  showPrintModal.value = true

  // 不再自动执行打印，让用户点击打印按钮手动触发
}

// 执行实际打印操作
const printBattery = () => {

  // 创建打印样式
  let printStyle = document.getElementById('print-style')
  if (!printStyle) {
    printStyle = document.createElement('style')
    printStyle.id = 'print-style'
    document.head.appendChild(printStyle)
  }

  // 设置打印样式，只显示打印内容
  printStyle.innerHTML = `
    @media print {
      body * {
        visibility: hidden;
      }
      #printContent, #printContent * {
        visibility: visible;
      }
      #printContent {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      .qrcode-img {
        display: flex;
        justify-content: center;
      }
      .factory-number {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        margin-top: 2px;
      }
      .product-info {
        font-size: 14px;
        margin-bottom: 5px;
      }
    }
  `

  // 执行打印
  window.print()

  // 打印对话框关闭后移除样式
  setTimeout(() => {
    // 不立即关闭模态框，让用户可以选择关闭
    // showPrintModal.value = false
  }, 500)
}

// 关闭打印预览
const closePrintModal = () => {
  showPrintModal.value = false
  currentPrintBattery.value = null
}

// 批量导出二维码为PDF
const exportQRCodesToPDF = async () => {
  if (batteries.value.length === 0) {
    ElMessage.warning('当前没有电池数据可导出')
    return
  }

  // 显示加载中
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在生成PDF，请稍候...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    // 创建一个正方形PDF文档（使用mm作为单位）
    const pdf = new jsPDF({
      orientation: 'portrait', // 纵向
      unit: 'mm',
      format: [150, 150] // 正方形格式，150mm x 150mm
    })

    // 创建临时容器用于渲染二维码
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'
    document.body.appendChild(container)

    // 为每个电池创建一个页面
    for (let i = 0; i < batteries.value.length; i++) {
      const battery = batteries.value[i]

      // 创建二维码容器
      const qrContainer = document.createElement('div')
      qrContainer.style.width = '150mm'
      qrContainer.style.height = '150mm'
      qrContainer.style.display = 'flex'
      qrContainer.style.flexDirection = 'column'
      qrContainer.style.justifyContent = 'center'
      qrContainer.style.alignItems = 'center'
      qrContainer.style.backgroundColor = 'white'
      qrContainer.style.padding = '10mm'

      // 创建二维码元素
      const qrDiv = document.createElement('div')
      qrDiv.style.display = 'flex'
      qrDiv.style.justifyContent = 'center'
      qrDiv.style.marginBottom = '10mm'
      qrContainer.appendChild(qrDiv)

      // 创建二维码图像
      const qrImg = document.createElement('img')
      qrImg.width = 200
      qrImg.height = 200
      qrDiv.appendChild(qrImg)

      // 创建文本信息
      const factoryNumberDiv = document.createElement('div')
      factoryNumberDiv.style.fontSize = '16px'
      factoryNumberDiv.style.fontWeight = 'bold'
      factoryNumberDiv.style.textAlign = 'center'
      factoryNumberDiv.textContent = battery.factoryNumber
      qrContainer.appendChild(factoryNumberDiv)

      //加入型号
      const productInfoDiv = document.createElement('div')
      productInfoDiv.style.fontSize = '14px'
      productInfoDiv.style.marginBottom = '5mm'
      productInfoDiv.textContent = `${battery.productName} ${battery.productModel}`
      qrContainer.appendChild(productInfoDiv)



      // 添加到临时容器
      container.appendChild(qrContainer)

      // 生成二维码图像
      // 直接使用QRCode.js库生成二维码图像URL
      const qrCodeUrl = await new Promise(resolve => {
        // 导入的qrcode库


        // 直接使用QRCode库生成二维码数据URLid
        qrcode.toDataURL(`http://www.ldlyj.cn/battery/${battery.id}`, {
          width: 200,
          margin: 1,
          errorCorrectionLevel: 'H'
        }, (err, url) => {
          if (err) {
            console.error('生成二维码失败:', err)
            // 发生错误时返回一个空白图像
            resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')
          } else {
            resolve(url)
          }
        })
      })

      // 设置二维码图像
      qrImg.src = qrCodeUrl as string

      // 等待图像加载完成
      await new Promise(resolve => {
        qrImg.onload = resolve
      })

      // 使用html2canvas将容器转换为图像
      const canvas = await html2canvas(qrContainer, {
        scale: 2, // 提高清晰度
        useCORS: true,
        logging: false
      })

      // 将图像添加到PDF
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 0, 0, 150, 150)

      // 如果不是最后一个电池，添加新页面
      if (i < batteries.value.length - 1) {
        pdf.addPage([150, 150], 'portrait')
      }

      // 从临时容器中移除
      container.removeChild(qrContainer)
    }

    // 保存PDF
    pdf.save(`电池二维码-${new Date().toISOString().slice(0, 10)}.pdf`)

    // 移除临时容器
    document.body.removeChild(container)

    ElMessage.success('二维码导出成功')
  } catch (error) {
    console.error('导出二维码失败:', error)
    ElMessage.error('导出二维码失败，请稍后重试')
  } finally {
    // 关闭加载中
    loadingInstance.close()
  }
}

// 页面加载时获取电池列表
onMounted(() => {
  fetchBatteryList()
})
</script>