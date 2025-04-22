<template>
  <div>
   <!-- 添加标题和搜索框区域 -->
   <div class="flex items-center justify-between mb-4">
     <div class="flex items-center">
       <h3 class="text-3xl font-medium text-gray-700">
         保修条例表
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
           placeholder="搜索条例内容"
           @input="handleSearch"
         >
       </div>
     </div>

     <div class="mt-4">
       <button @click="showAddModal = true" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
         添加条例
       </button>
     </div>
   </div>

   <div class="flex flex-col mt-8">
     <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
       <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
         <table class="min-w-full">
           <thead>
             <tr>
               <th
                 class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                 条例编号
               </th>
               <th
                 class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                 条例内容
               </th>
               <th
                 class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                 创建时间
               </th>
               <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
             </tr>
           </thead>

           <tbody class="bg-white">
             <tr v-if="loading" class="text-center">
               <td colspan="4" class="px-6 py-4 border-b border-gray-200">
                 <div class="flex justify-center">
                   <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                 </div>
               </td>
             </tr>
             <tr v-else-if="regulations.length === 0" class="text-center">
               <td colspan="4" class="px-6 py-4 border-b border-gray-200">暂无数据</td>
             </tr>
             <tr v-for="(regulation, index) in regulations" :key="index" v-else>
               <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                 {{ regulation.id }}
               </td>

               <td class="px-6 py-4 border-b border-gray-200">
                 {{ regulation.termContent }}
               </td>

               <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                 {{ regulation.createTime }}
               </td>

               <td
                 class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                 <button @click="editRegulation(index)" class="text-indigo-600 hover:text-indigo-900 mr-4">编辑</button>
                 <button @click="deleteRegulation(index)" class="text-red-600 hover:text-red-900">删除</button>
               </td>
             </tr>
           </tbody>
         </table>
       </div>
     </div>
   </div>

   <!-- 添加/编辑条例的模态框 -->
   <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
     <div class="bg-white p-6 rounded-lg w-1/2">
       <h3 class="text-xl font-medium mb-4">{{ showEditModal ? '编辑条例' : '添加条例' }}</h3>
       
       <div class="mb-4" v-if="showEditModal">
         <label class="block text-gray-700 text-sm font-bold mb-2" for="id">
           条例编号
         </label>
         <input 
           id="id" 
           v-model="currentRegulation.id" 
           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
           type="text" 
           placeholder="编号由系统自动生成"
           disabled
         >
       </div>
       
       <div class="mb-4">
         <label class="block text-gray-700 text-sm font-bold mb-2" for="termContent">
           条例内容 <span class="text-red-500">*</span>
         </label>
         <textarea 
           id="termContent" 
           v-model="currentRegulation.termContent" 
           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
           placeholder="请输入条例内容"
           rows="4"
           required
         ></textarea>
       </div>
       
       <div class="mb-4" v-if="showEditModal">
         <label class="block text-gray-700 text-sm font-bold mb-2" for="createTime">
           创建时间
         </label>
         <input 
           id="createTime" 
           v-model="currentRegulation.createTime" 
           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
           type="date" 
           disabled
         >
       </div>
       
       <div class="flex justify-end">
         <button @click="cancelEdit" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
           取消
         </button>
         <button @click="saveRegulation" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
           保存
         </button>
       </div>
     </div>
   </div>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllWarrantyClause, addWarrantyClause } from '../api/api'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Regulation {
 id: string
 termContent: string
 createTime?: string
}

// 添加搜索关键字
const searchKey = ref('')

// 添加loading状态变量
const loading = ref(false)

// 保修条例数据
const regulations = ref<Regulation[]>([])

// 控制模态框显示
const showAddModal = ref(false)
const showEditModal = ref(false)
const editIndex = ref(-1)

// 当前编辑的条例
const currentRegulation = ref<Regulation>({
 id: '',
 termContent: '',
 createTime: new Date().toISOString().split('T')[0] // 默认为当前日期
})

// 搜索处理函数
const handleSearch = () => {
 // 本地搜索实现，因为保修条例没有分页API
 fetchAllWarrantyClause()
}

// 获取所有保修条例
const fetchAllWarrantyClause = async () => {
 try {
   loading.value = true
   const response = await getAllWarrantyClause()
   
   if (response.code === 200) {
     const allRegulations = response.data || []
     
     // 如果有搜索关键字，进行本地过滤
     if (searchKey.value) {
       regulations.value = allRegulations.filter(reg => 
         reg.termContent.toLowerCase().includes(searchKey.value.toLowerCase()) ||
         reg.id.toString().includes(searchKey.value)
       )
     } else {
       regulations.value = allRegulations
     }
   } else {
     ElMessage.error(response.message || '获取保修条例失败')
     console.error('获取保修条例失败:', response.message)
   }
 } catch (error) {
   console.error('获取保修条例失败:', error)
   ElMessage.error('获取保修条例失败，请稍后重试')
 } finally {
   loading.value = false
 }
}

// 编辑条例
const editRegulation = (index: number) => {
 editIndex.value = index
 currentRegulation.value = { ...regulations.value[index] }
 showEditModal.value = true
}

// 删除条例
const deleteRegulation = (index: number) => {
 ElMessageBox.confirm('确定要删除这条保修条例吗？', '提示', {
   confirmButtonText: '确定',
   cancelButtonText: '取消',
   type: 'warning'
 }).then(() => {
   regulations.value.splice(index, 1)
   ElMessage.success('删除成功')
 }).catch(() => {
   ElMessage.info('已取消删除')
 })
}

// 保存条例
const saveRegulation = async () => {
 // 验证必填字段
 if (!currentRegulation.value.termContent) {
   ElMessage.warning('条例内容为必填项！')
   return
 }

 try {
   loading.value = true
   
   if (showEditModal.value) {
     // 更新现有条例
     // 这里应该调用更新API，但目前API中没有提供，暂时只在前端更新
     regulations.value[editIndex.value] = { ...currentRegulation.value }
     ElMessage.success('更新条例成功')
   } else {
     // 添加新条例 - 只传递内容，id和创建时间由后台自动生成
     const newRegulation = { 
       termContent: currentRegulation.value.termContent
     }
     
     // 调用添加保修条例API
     const response = await addWarrantyClause(newRegulation)
     
     if (response.code === 200) {
       ElMessage.success('添加条例成功')
       // 添加成功后重新获取最新列表
       await fetchAllWarrantyClause()
     } else {
       ElMessage.error(response.message || '添加条例失败')
     }
   }
 } catch (error) {
   console.error('保存条例失败:', error)
   ElMessage.error('保存条例失败，请稍后重试')
 } finally {
   loading.value = false
   // 关闭模态框并重置表单
   cancelEdit()
 }
}

// 取消编辑
const cancelEdit = () => {
 showAddModal.value = false
 showEditModal.value = false
 currentRegulation.value = {
   id: '',
   termContent: '',
   createTime: new Date().toISOString().split('T')[0] // 仅用于显示
 }
}

// 页面加载时获取保修条例
onMounted(() => {
 fetchAllWarrantyClause()
})
</script>