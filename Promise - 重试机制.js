// Promise 重试机制
// 实现一个函数 retryPromise(fn, maxRetry, delay)，接收三个参数：
// fn：返回 Promise 的函数（执行可能失败）；
// maxRetry：最大重试次数（如 3 次）；
// delay：每次重试的间隔时间（毫秒）。
// 要求：
// 执行fn，若失败则等待delay后重试，最多重试maxRetry次；
// 若某次执行成功，立即 resolve 结果；
// 若所有重试都失败，reject 最后一次的错误信息；
// 重试间隔需准确，且重试次数包含首次执行（如 maxRetry=3，最多执行 3 次）。

function retryPromise(fn, maxRetry, delay) {
    return new Promise((resolve,reject)=>{
        let retryCount = 1;
        const retry = () => {
            fn().then(resolve).catch((err) => {
                console.log(retryCount + '次',err)
                if(retryCount < maxRetry){
                    setTimeout(() => {
                        retryCount++;
                        retry();
                    }, delay);
                }else{
                    reject(err)
                }
            })
        }
        retry()
    })
}

const fn = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (Math.random() > 0.8) {
            resolve('success')
        } else {
            reject('fail')
        }
    }, Math.random() * 1000)
})

retryPromise(fn, 3, 100).then((res) => {
    console.log(res)
}).catch((err) => {
    console.log(err)
})