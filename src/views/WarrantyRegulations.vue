<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">
      保修条例表
    </h3>

    <div class="mt-4">
      <button @click="showAddModal = true" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        添加条例
      </button>
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
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(regulation, index) in regulations" :key="index">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ regulation.id }}
                </td>

                <td class="px-6 py-4 border-b border-gray-200">
                  {{ regulation.content }}
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
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="id">
            条例编号 <span class="text-red-500">*</span>
          </label>
          <input 
            id="id" 
            v-model="currentRegulation.id" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            placeholder="请输入条例编号"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="content">
            条例内容 <span class="text-red-500">*</span>
          </label>
          <textarea 
            id="content" 
            v-model="currentRegulation.content" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            placeholder="请输入条例内容"
            rows="4"
            required
          ></textarea>
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
import { ref } from 'vue'

interface Regulation {
  id: string
  content: string
}

// 示例数据
const regulations = ref<Regulation[]>([
  {
    id: 'REG001',
    content: '产品自购买之日起享受一年的免费保修服务，电池部分享受六个月的免费保修服务。'
  },
  {
    id: 'REG002',
    content: '保修期内，因产品本身质量问题引起的故障，请凭保修卡和购机发票到指定维修点享受免费保修服务。'
  },
  {
    id: 'REG003',
    content: '下列情况不属于免费保修范围：1. 人为损坏；2. 未按产品使用说明书要求使用、维护、保管导致的故障；3. 非授权维修机构拆动造成的损坏。'
  }
])

// 控制模态框显示
const showAddModal = ref(false)
const showEditModal = ref(false)
const editIndex = ref(-1)

// 当前编辑的条例
const currentRegulation = ref<Regulation>({
  id: '',
  content: ''
})

// 编辑条例
const editRegulation = (index: number) => {
  editIndex.value = index
  currentRegulation.value = { ...regulations.value[index] }
  showEditModal.value = true
}

// 删除条例
const deleteRegulation = (index: number) => {
  if (confirm('确定要删除这条保修条例吗？')) {
    regulations.value.splice(index, 1)
  }
}

// 取消编辑
const cancelEdit = () => {
  showAddModal.value = false
  showEditModal.value = false
  currentRegulation.value = {
    id: '',
    content: ''
  }
}

// 保存条例
const saveRegulation = () => {
  // 验证必填字段
  if (!currentRegulation.value.id || !currentRegulation.value.content) {
    alert('条例编号和条例内容为必填项！')
    return
  }

  if (showEditModal.value) {
    // 更新现有条例
    regulations.value[editIndex.value] = { ...currentRegulation.value }
  } else {
    // 添加新条例
    regulations.value.push({ ...currentRegulation.value })
  }

  // 关闭模态框并重置表单
  cancelEdit()
}
</script>