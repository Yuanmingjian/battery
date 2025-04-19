<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">
      电子保修单信息表
    </h3>

    <div class="flex flex-col mt-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table class="min-w-full" id="printTable">
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

                <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <button @click="exportToPrint" class="text-indigo-600 hover:text-indigo-900">打印</button>
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

  
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'
import { ElPagination, ElMessage } from 'element-plus'
import { addBattery as addBatteryApi, getBatteryList, addBatteries, getWarrantyOrderList } from '../api/api'

interface Battery {
  factoryNumber: string
  productName: string
  productModel: string
  productionDate: string
  customerName: string
  contactNumber: string
  customerAddress: string
  sellerPhone: string
}

// 电池数据列表
const batteries = ref<Battery[]>([])
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

// 获取保修单列表数据
const fetchWarrantyOrderList = async () => {
  try {
    loading.value = true
    // 调用API时传递分页参数
    const response = await getWarrantyOrderList({ pageNum: currentPage.value, pageSize: pageSize.value })
    
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
    factoryNumber: 'SN123456789',
    productName: '高性能电池',
    productModel: 'Model-X',
    productionDate: '2023-10-01',
    customerName: '张三',
    contactNumber: '13800138000',
    customerAddress: '北京市海淀区中关村',
    sellerPhone: '13900139000'
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


// 页面加载时获取保修单列表
onMounted(() => {
  fetchWarrantyOrderList()
})
</script>