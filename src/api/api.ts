// API基础URL - 使用相对路径，通过Vite代理转发请求
const BASE_URL = '/api';

// 请求方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 请求配置接口
interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

// 响应结果接口
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 封装的API请求方法
 * @param url 请求路径
 * @param config 请求配置
 * @returns Promise<ApiResponse<T>>
 */
export async function request<T = any>(url: string, config: RequestConfig): Promise<ApiResponse<T>> {
  // 构建完整URL
  const fullUrl = `${BASE_URL}${url}`;
  
  // 默认请求头 携带token
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `${token}` ,
    ...config.headers
  };
  
  // 如果有请求体且是对象，则转换为JSON字符串
  let body = config.body;
  if (body && typeof body === 'object') {
    body = JSON.stringify(body);
  }
  
  try {
    // 发送请求
    const response = await fetch(fullUrl, {
      method: config.method,
      headers,
      body,
    });
    
    // 解析响应JSON
    const data = await response.json();
    
    // 返回API响应
    return data as ApiResponse<T>;
  } catch (error) {
    // 处理请求错误
    console.error('API请求错误:', error);
    throw error;
  }
}

/**
 * 用户登录接口
 * @param account 用户账号
 * @param password 用户密码
 * @returns Promise<ApiResponse>
 */
export async function login(account: string, password: string): Promise<ApiResponse> {
  return request('/user/login', {
    method: 'POST',
    body: {
      account,
      password
    }
  });
}

/**
 * 添加电池接口
 * @param batteryData 电池数据
 * @returns Promise<ApiResponse>
 */
export async function addBattery(batteryData: any): Promise<ApiResponse> {
  return request('/battery/add', {
    method: 'POST',
    body: batteryData
  });
}

// 批量添加电池接口
export async function addBatteries(batteryDatas: any): Promise<ApiResponse> {
  return request('/battery/batchAdd', {
    method: 'POST',
    body: batteryDatas
  });
}


/**
 * 获取电池列表接口
 * @param params 查询参数
 * @returns Promise<ApiResponse>
 */
export async function getBatteryList(body:any): Promise<ApiResponse> {
  return request(`/battery/page?`, {
    method: 'POST',
    body
  });
}

// 获取保修订单的分页接口
export async function getWarrantyOrderList(body:any): Promise<ApiResponse> {
  return request(`/warrantyorder/page?`, {
    method: 'POST',
    body
  });
}


//获取保修条例接口
export async function getWarrantyClause(): Promise<ApiResponse> {
  return request(`/warrantyclause/get`, {
    method: 'GET',
  });
}

//通过id删除电池
export async function deleteBatteryById(id:number): Promise<ApiResponse> {
  return request(`/battery/delete/${id}`, {
    method: 'POST',
  });
}

//获取所有保修条例表
export async function getAllWarrantyClause(): Promise<ApiResponse> {
  return request(`/warrantyterms/list`, {
    method: 'GET',
  }); 
}