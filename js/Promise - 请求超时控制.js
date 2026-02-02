//题目2：Promise应用场景题 - 请求超时控制
//实现一个带超时控制的请求函数fetchWithTimeout，它接受一个URL和一个超时时间（毫秒）作为参数。要求：
//
//如果请求在超时时间内完成，返回请求结果
//
//如果请求超时，抛出错误（Error对象），错误信息为"Request timeout"
//
//无论成功或失败，都需要清理相关定时器

async function fetchWithTimeout(url, timeout) {
    let timeoutId = null;

    const promise1 = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error('Request timeout'));
        }, timeout);
    })
    const promise2 = fetch(url)

    return Promise.race([promise1, promise2]).finally(() => {
        clearTimeout(timeoutId);
    });
}




const withTimeout = (promise, timeout) => {
    let timeoutId = null
    const promise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('超时了')
        }, timeout)
    })

    Promise.race([promise, promise1]).then((res) => {
        console.log('then', res)
    }).catch((err) => {
        console.log('catch', err)
    }).finally(
        clearTimeout(timeoutId)
    )
}

const mockPromise = (name) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.2) {
                resolve(name + ':success')
            } else {
                reject(name + ':fail')
            }
        }, Math.random() * 1000)
    })
}

withTimeout(mockPromise('task1'), 400)