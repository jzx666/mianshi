// 基础实体接口
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

// 1. 定义API成功响应类型（包含data、status、message字段）
interface ApiSuccessResponse<T> {
  data: T;
  status: number;
  message: string;
}

// 2. 定义API错误响应类型（包含error、status、message字段）
interface ApiErrorResponse {
  error: string;
  status: number;
  message: string;
}

// 3. 定义联合类型：API响应可能是成功或错误响应
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// 4. 实现类型守卫函数，判断是否为成功响应
function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return 'data' in response;
}

// 5. 实现一个函数，正确处理API响应数据
function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (isSuccessResponse(response)) {
    return response.data;
  } else {
    throw new Error(`${response.status}: ${response.message}`);
  }
}

// 使用示例
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: '张三', email: 'zhang@example.com', role: 'admin' },
  status: 200,
  message: 'success'
};

// 使用类型守卫
if (isSuccessResponse(userResponse)) {
  console.log(userResponse.data); // 这里能正确推断为User类型
}

// 使用处理函数
const user = handleApiResponse(userResponse); // user是User类型