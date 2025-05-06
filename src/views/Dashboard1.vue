<template>
  <div>
    <!-- 添加标题和搜索框区域 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <h3 class="text-3xl font-medium text-gray-700">
          电子保修单信息表
        </h3>
        <!-- 添加搜索框 -->
        <div class="relative mx-4 lg:ml-30 ml-6">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          <input
            v-model="searchKey"
            class="w-32 pl-10 pr-4 text-indigo-600 border-gray-200 rounded-md sm:w-64 focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            type="text"
            placeholder="搜索保修单信息"
            @input="handleSearch"
          >
        </div>
      </div>
      
      <div class="mt-4 flex space-x-2">
        <button @click="exportToExcel" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出Excel
        </button>
        <button @click="showAddModal = true" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          添加保修单
        </button>
      </div>
    </div>

    <div class="flex flex-col mt-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table class="" id="printTable">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  电池出厂编号
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  产品名称
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  产品型号
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  出厂日期
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  客户姓名
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  联系方式
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  客户地址
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  销售商电话
                </th>

                <th
                  class="px-4 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                   保修年限(年)
                </th>
                <th
                  class="px-4 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  保修开始日期
                </th>
                <th
                  class="px-4 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  保修结束日期
                </th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-if="loading" class="text-center">
                <td colspan="11" class="px-6 py-4 border-b border-gray-200">
                  <div class="flex justify-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="batteries.length === 0" class="text-center">
                <td colspan="11" class="px-6 py-4 border-b border-gray-200">暂无数据</td>
              </tr>
              <tr v-for="(b, index) in batteries" :key="index" v-else>
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
                  {{ b.customerName }}
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ b.contactNumber}}
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ b.customerAddress }}
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ b.sellerPhone }}
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{b.warrantyPeriod}}
                </td>
                <td class="px-4 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ b.warrantyBegin }}
                </td>

                <td class="px-4 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ b.warrantyEnd }}
                </td>

                <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <div class="flex space-x-2 justify-end">
                    <button @click="handleEdit(b)" class="text-blue-600 hover:text-blue-900">编辑</button>
                    <button @click="handleDelete(b.id!)" class="text-red-600 hover:text-red-900">删除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 添加分页组件 -->
    <div class="flex justify-center mt-6">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, total"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 添加/编辑保修单的模态框 -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-1/2">
        <h3 class="text-xl font-medium mb-4">{{ isEditMode ? '编辑保修单' : '添加保修单' }}</h3>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="factoryNumber">
            电池出厂编号 <span class="text-red-500">*</span>
          </label>
          <select
            id="factoryNumber"
            v-model="newWarranty.factoryNumber"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            @change="handleFactoryNumberChange"
          >
            <option value="" disabled>请选择电池出厂编号</option>
            <option v-for="(number, index) in batteryOptions.factoryNumbers" :key="index" :value="number">
              {{ number }}
            </option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productName">
            产品名称 <span class="text-red-500">*</span>
          </label>
          <select
            id="productName"
            v-model="newWarranty.productName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>请选择产品名称</option>
            <option v-for="(name, index) in batteryOptions.productNames" :key="index" :value="name">
              {{ name }}
            </option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productModel">
            产品型号 <span class="text-red-500">*</span>
          </label>
          <input 
            id="productModel" 
            v-model="newWarranty.productModel" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            placeholder="请输入产品型号"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="productionDate">
            出厂日期 <span class="text-red-500">*</span>
          </label>
          <input 
            id="productionDate" 
            v-model="newWarranty.productionDate" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="date" 
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="customerName">
            客户姓名 <span class="text-red-500">*</span>
          </label>
          <input 
            id="customerName" 
            v-model="newWarranty.customerName" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            placeholder="请输入客户姓名"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="contactNumber">
            联系方式 <span class="text-red-500">*</span>
          </label>
          <input 
            id="contactNumber" 
            v-model="newWarranty.contactNumber" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            placeholder="请输入联系方式"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="customerAddress">
            客户地址 <span class="text-red-500">*</span>
          </label>
          <input 
            id="customerAddress" 
            v-model="newWarranty.customerAddress" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            placeholder="请输入客户地址"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="sellerPhone">
            销售商电话 <span class="text-red-500">*</span>
          </label>
          <input 
            id="sellerPhone" 
            v-model="newWarranty.sellerPhone" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            placeholder="请输入销售商电话"
            required
          >
        </div>
        
       
        
        <div class="flex justify-end">
          <button @click="cancelAdd" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
            取消
          </button>
          <button @click="addNewWarrantyOrder" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            保存
          </button>
        </div>
      </div>
    </div>
  
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'
import { ElPagination, ElMessage, ElMessageBox } from 'element-plus'
import { addBattery as addBatteryApi, getBatteryList, addBatteries, getWarrantyOrderList, deleteWarrantyOrder, addWarrantyOrder, updateWarrantyOrder } from '../api/api'

interface Battery {
  id?: number
  factoryNumber: string
  productName: string
  productModel: string
  productionDate: string
  customerName: string
  contactNumber: string
  customerAddress: string
  sellerPhone: string
  warrantyBegin?: string
  warrantyEnd?: string
  warrantyPeriod?: string
}

// 电池数据列表
const batteries = ref<Battery[]>([])
const loading = ref(false)

// 可选的电池出厂编号和产品名称列表
const batteryOptions = ref<{factoryNumbers: string[], productNames: string[]}>({factoryNumbers: [], productNames: []})

// 保存所有电池数据，用于自动填充
const allBatteryData = ref<any[]>([])

// 添加搜索关键字
const searchKey = ref('')

// 是否为编辑模式
const isEditMode = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(8)
const total = ref(0)

// 搜索处理函数
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
  fetchWarrantyOrderList() // 重新获取数据
}

// 获取保修单列表数据
const fetchWarrantyOrderList = async () => {
  try {
    loading.value = true
    // 调用API时传递分页参数和搜索关键字
    const response = await getWarrantyOrderList({
      pageParam: {
        pageNum: currentPage.value,
        pageSize: pageSize.value
      },
      key: searchKey.value
    })
    
    if (response.code === 200) {
      // 假设后端返回的数据结构包含 data 和 total
      if (response.data) {
        batteries.value = response.data.data || []
        total.value = response.data.total || 0
      } else {
        batteries.value = []
        total.value = 0
      }
    } else {
      ElMessage.error(response.message || '获取保修单列表失败')
      // 如果API不可用，使用测试数据
      useMockData()
    }
  } catch (error) {
    console.error('获取保修单列表失败:', error)
    // 如果API不可用，使用测试数据
    useMockData()
  } finally {
    loading.value = false
  }
}

// 使用测试数据（当API不可用时）
const useMockData = () => {
  const testBattery: Battery = {
    id:1,
    factoryNumber: 'SN123456789',
    productName: '高性能电池',
    productModel: 'Model-X',
    productionDate: '2023-10-01',
    customerName: '张三',
    contactNumber: '13800138000',
    customerAddress: '北京市海淀区中关村',
    sellerPhone: '13900139000',
    warrantyBegin: '2023-10-01',
    warrantyEnd: '2024-10-01'
  }
  
  batteries.value = [...Array(10).keys()].map(() => ({
    ...testBattery,
    factoryNumber: `SN123456789-${Math.floor(Math.random() * 1000)}`,
    customerName: `客户${Math.floor(Math.random() * 100)}`,
    contactNumber: `13800${Math.floor(Math.random() * 10000)}`,
    customerAddress: `地址${Math.floor(Math.random() * 100)}`,
    sellerPhone: `13900${Math.floor(Math.random() * 10000)}`
  }))
  total.value = batteries.value.length
}

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  console.log('页码变化:', currentPage.value)
  
  // 页码变化时重新获取数据
  fetchWarrantyOrderList()
}

// 监听页码和每页数量变化，重新获取数据
watch([currentPage, pageSize], () => {
  fetchWarrantyOrderList()
})

const exportToPrint = () => {
  const printContents = document.getElementById('printTable')?.innerHTML;
  const windowUrl = 'about:blank';
  const printWindow = window.open(windowUrl, '_blank');

}

// 导出电池数据为Excel
const exportToExcel = async () => {
  try {
    loading.value = true
    ElMessage.info('正在准备导出数据...')
    
    // 获取所有电池数据（不分页）
    const response = await getWarrantyOrderList({
      pageParam: {
        pageNum: 0,
        pageSize: 0
      }
    })
    
    if (response.code === 200 && response.data) {
      const batteryData = response.data.data || []
      
      if (batteryData.length === 0) {
        ElMessage.warning('没有可导出的数据')
        return
      }
      
      // 准备Excel数据
      const excelData = batteryData.map(item => ({
        '电池出厂编号': item.factoryNumber,
        '产品名称': item.productName,
        '产品型号': item.productModel,
        '出厂日期': item.productionDate,
        '客户姓名': item.customerName,
        '联系方式': item.contactNumber,
        '客户地址': item.customerAddress,
        '销售商电话': item.sellerPhone,
        '保修开始日期': item.warrantyBegin,
        '保修结束日期': item.warrantyEnd
      }))
      
      // 创建工作簿
      const worksheet = XLSX.utils.json_to_sheet(excelData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '电池数据')
      
      // 生成Excel文件并下载
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      
      // 创建下载链接
      const fileName = `电池数据_${new Date().toISOString().split('T')[0]}.xlsx`
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(blob)
      downloadLink.download = fileName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      
      ElMessage.success('导出成功')
    } else {
      ElMessage.error(response.message || '导出失败')
    }
  } catch (error) {
    console.error('导出Excel失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  } finally {
    loading.value = false
  }
}


// 获取所有电池数据，用于下拉选择框
const fetchAllBatteries = async () => {
  try {
    const response = await getBatteryList({
      pageParam: {
        pageNum: 0,
        pageSize: 0 // 获取足够多的数据以供选择
      }
    })
    
    if (response.code === 200 && response.data) {
      // 提取所有不重复的电池出厂编号和产品名称
      const batteryData = response.data.data || []
      const factoryNumbers = [...new Set(batteryData.map(item => item.factoryNumber))]as string[]
      const productNames = [...new Set(batteryData.map(item => item.productName))]as string[]
      
      batteryOptions.value = {
        factoryNumbers,
        productNames
      }
      
      // 保存完整的电池数据，用于后续自动填充
      allBatteryData.value = batteryData
    } else {
      // 如果API不可用，使用测试数据
      batteryOptions.value = {
        factoryNumbers: ['SN123456789', 'SN123456790', 'SN123456791'],
        productNames: ['高性能电池', '标准电池', '长效电池']
      }
      
      // 测试数据
      allBatteryData.value = [
        { factoryNumber: 'SN123456789', productName: '高性能电池', productModel: 'Model-X' },
        { factoryNumber: 'SN123456790', productName: '标准电池', productModel: 'Model-Y' },
        { factoryNumber: 'SN123456791', productName: '长效电池', productModel: 'Model-Z' }
      ]
    }
  } catch (error) {
    console.error('获取电池列表失败:', error)
    // 使用测试数据
    batteryOptions.value = {
      factoryNumbers: ['SN123456789', 'SN123456790', 'SN123456791'],
      productNames: ['高性能电池', '标准电池', '长效电池']
    }
    
    // 测试数据
    allBatteryData.value = [
      { factoryNumber: 'SN123456789', productName: '高性能电池', productModel: 'Model-X' },
      { factoryNumber: 'SN123456790', productName: '标准电池', productModel: 'Model-Y' },
      { factoryNumber: 'SN123456791', productName: '长效电池', productModel: 'Model-Z' }
    ]
  }
}

// 页面加载时获取保修单列表和电池数据
onMounted(() => {
  fetchWarrantyOrderList()
  fetchAllBatteries()
})

// 处理删除保修订单
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除这个保修订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      loading.value = true
      const response = await deleteWarrantyOrder(id)
      
      if (response.code === 200) {
        ElMessage.success('删除成功')
        // 删除后重新获取数据
        await fetchWarrantyOrderList()
      } else {
        ElMessage.error(response.message || '删除失败')
      }
    } catch (error) {
      console.error('删除保修订单失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }).catch(() => {
    // 用户取消删除操作
    ElMessage.info('已取消删除')
  })
}

// 控制模态框显示
const showAddModal = ref(false)

// 新保修单数据
const newWarranty = ref<Battery>({
  factoryNumber: '',
  productName: '',
  productModel: '',
  productionDate: '',
  customerName: '',
  contactNumber: '',
  customerAddress: '',
  sellerPhone: '',
  warrantyBegin: '',
  warrantyEnd: ''
})

// 取消添加或编辑保修单
const cancelAdd = () => {
  showAddModal.value = false
  isEditMode.value = false
  resetNewWarranty()
}

// 处理编辑操作
const handleEdit = (battery: Battery) => {
  isEditMode.value = true
  // 复制电池数据到表单
  newWarranty.value = { ...battery }
  // 显示模态框
  showAddModal.value = true
}

// 当选择电池出厂编号时，自动填充产品名称和型号
const handleFactoryNumberChange = () => {
  const selectedBattery = allBatteryData.value.find(b => b.factoryNumber === newWarranty.value.factoryNumber)
  if (selectedBattery) {
    newWarranty.value.productName = selectedBattery.productName
    newWarranty.value.productModel = selectedBattery.productModel
    newWarranty.value.productionDate = selectedBattery.productionDate
  }
}

// 重置新保修单数据
const resetNewWarranty = () => {
  newWarranty.value = {
    factoryNumber: '',
    productName: '',
    productModel: '',
    productionDate: '',
    customerName: '',
    contactNumber: '',
    customerAddress: '',
    sellerPhone: '',
    warrantyBegin: '',
    warrantyEnd: ''
  }
}

// 添加或更新保修单
const addNewWarrantyOrder = async () => {
  // 验证必填字段
  if (!newWarranty.value.factoryNumber || 
      !newWarranty.value.productName || 
      !newWarranty.value.productModel || 
      !newWarranty.value.productionDate ||
      !newWarranty.value.customerName ||
      !newWarranty.value.contactNumber ||
      !newWarranty.value.customerAddress ||
      !newWarranty.value.sellerPhone 
      ) {
    ElMessage.warning('所有字段均为必填项！')
    return
  }

  try {
    loading.value = true
    let response
    if (isEditMode.value) {
      // 调用API更新保修单
      response = await updateWarrantyOrder(newWarranty.value)
    } else {
      // 调用API添加保修单
      response = await addWarrantyOrder(newWarranty.value)
    }
    
    if (response.code === 200) {
      ElMessage.success(isEditMode.value ? '更新保修单成功' : '添加保修单成功')

      // 关闭模态框并重置表单
      showAddModal.value = false
      resetNewWarranty()

      // 添加新数据后返回第一页并重新获取数据
      currentPage.value = 1
      await fetchWarrantyOrderList()
    } else {
      ElMessage.error(response.message || (isEditMode.value ? '更新保修单失败' : '添加保修单失败'))
    }
  } catch (error) {
    console.error(isEditMode.value ? '更新保修单失败:' : '添加保修单失败:', error)
    ElMessage.error(isEditMode.value ? '更新保修单失败，请稍后重试' : '添加保修单失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>