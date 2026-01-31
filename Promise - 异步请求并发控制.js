// Promise 应用题 - 异步请求并发控制
// 实现一个函数 requestWithLimit(urls, limit)，接收两个参数：
// urls：一个包含多个接口地址的数组；
// limit：最大并发数（如 limit=3 表示同时最多有 3 个请求在执行）。
// 要求：
// 使用 Promise 封装异步请求（可模拟请求，用 setTimeout 模拟接口响应时间）；
// 控制请求的并发数不超过limit；
// 所有请求完成后，按 urls 的顺序返回每个请求的结果（成功返回响应数据，失败返回错误信息）；
// 禁止使用第三方库，仅使用原生 JS 实现。

// 实现思路
// 模拟请求函数：封装一个fetchUrl函数，用setTimeout模拟异步请求，随机成功 / 失败，返回 Promise。
// 并发控制核心：
// 维护一个 “执行队列” 和 “结果数组”，结果数组的顺序与输入 urls 一致；
// 先启动limit个请求，每完成一个请求，就从队列中取出下一个 url 继续执行；
// 用 Promise.all 等待所有请求完成，最终返回结果数组。
// 边界处理：空 urls 直接返回空数组，limit≤0 时默认设为 1。

const fetchUrl = (url) => {
  return new Promise((res, rej) => {
    const responseTime = Math.random() * 1000
    setTimeout(() => {
      if (Math.random() < 0.7) {
        res({
            url,
            status:'success',
            responseTime
        });
      } else {
        rej({
            url,
            status:'fail',
            responseTime
        });
      }
    }, responseTime);
  });
};

function requestWithLimit(urls, limit){
    if(!Array.isArray(urls) || urls.length === 0){
        return []
    }
    const maxLimit = Math.max(limit,1);
    const results = []
    const urlQueue = [...urls]
    let currentCount = 0;//当前并发数
    let resolveAll;
    const allDone = new Promise(resolve => {
        resolveAll = resolve
    })

    
    const runNext = () => {
        if(urlQueue.length === 0 && currentCount === 0){
            resolveAll(results)
        }

        while(currentCount < maxLimit && urlQueue.length > 0){//当前并发数小于最大并发 或 请求任务还有未执行的
            const url = urlQueue.shift()
            const idx = urls.indexOf(url)
            currentCount++

            fetchUrl(url).then(res => {
                results[idx] = res
            }).catch(err => {
                results[idx] = err
            }).finally(() => {
                currentCount--
                runNext()
            })
        }
    }

    runNext()
    return allDone
}


// ------------------- 测试用例 -------------------
const testUrls = [
  'https://api.example/1',
  'https://api.example/2',
  'https://api.example/3',
  'https://api.example/4',
  'https://api.example/5',
  'https://api.example/6'
];

// 测试并发数为2的情况
requestWithLimit(testUrls, 2).then(results => {
  console.log('所有请求结果（按原顺序）：');
  console.log(results);
});