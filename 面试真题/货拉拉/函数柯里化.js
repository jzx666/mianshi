// 题目要求：
// 在开发一个HTTP请求库时，你发现很多请求都需要相同的 baseURL 和 headers 配置，但每次都要重复传入这些参数。
// 场景说明：
// ● 所有API请求都需要baseURL（如：'https://api.example.com'）
// ● 大部分请求需要相同的headers（如：认证token、Content-Type等）
// ● 只有少数请求需要额外的自定义headers
// ● 需要支持GET、POST、PUT、DELETE等不同请求方法


// 原始实现（存在问题）
function makeRequest(method, baseURL, headers, url, data) {
  const fullURL = `${baseURL}${url}`;
  const requestHeaders = { ...headers };
  
  return fetch(fullURL, {
    method,
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined
  }).then(res => res.json());
}

// 使用示例（每次都要传入重复的baseURL和headers）
const baseURL = 'https://api.example.com';
const commonHeaders = {
  'Authorization': 'Bearer token123',
  'Content-Type': 'application/json'
};

// 问题：每次调用都要重复传入baseURL和commonHeaders
makeRequest('GET', baseURL, commonHeaders, '/users', null);
makeRequest('POST', baseURL, commonHeaders, '/users', { name: 'John' });
makeRequest('GET', baseURL, commonHeaders, '/products', null);

// 如果某个请求需要额外的header，需要手动合并
const customHeaders = { ...commonHeaders, 'X-Custom-Header': 'value' };
makeRequest('PUT', baseURL, customHeaders, '/users/1', { name: 'Jane' });





// ========== 请优化以上代码 ==========
// 要求：
// 1. 实现一个 fn
// 2. 使用 fn 优化 makeRequest，实现参数复用
// 3. 支持以下使用方式：
//    - 先配置 baseURL，创建新的函数
//    - 再配置 headers，创建新的函数
//    - 最后调用时只需要传入 method、url 和 data
// 4. 支持部分应用，可以灵活组合参数

//期望的使用方式示例：
const fn2 = fn(makeRequest)
const requestWithBaseURL = fn2(baseURL);
const requestWithHeaders = requestWithBaseURL(commonHeaders);
requestWithHeaders('GET', '/users', null);
requestWithHeaders('POST', '/users', { name: 'John' });

//或者支持链式调用：
fn2(baseURL)(commonHeaders)('GET', '/users', null);

//或者部分应用：
const apiRequest = fn2(baseURL)(commonHeaders);
apiRequest('GET', '/products', null);
apiRequest('POST', '/orders', { productId: 123 });





// 通用柯里化函数
function curry(fn) {
    return function curried(...args) {
        // 如果传递的参数数量足够，直接执行原函数
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        // 否则返回一个新函数，继续收集参数
        return function(...nextArgs) {
            return curried.apply(this, args.concat(nextArgs));
        };
    };
}