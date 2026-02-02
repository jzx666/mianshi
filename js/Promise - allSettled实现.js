// 题目 4：Promise.allSettled 手动实现
// 原生Promise.allSettled会等待所有 Promise 完成（无论成功 / 失败），
// 并返回每个 Promise 的结果对象（{status, value/reason}）。
// 要求：不使用原生Promise.allSettled，手动实现一个功能完全一致的函数 myAllSettled(promises)。

const myAllSettled = (promises) => {
    return new Promise((resolve, reject) => {
        const results = []
        let count = 0
        for (let i = 0; i < promises.length; i++) {
            promises[i].then((res) => {
                results[i] = { status: 'fulfilled', value: res }
                count++
                if (count === promises.length) {
                    resolve(results)
                }
            }).catch((err) => {
                results[i] = { status: 'rejected', reason: err }
                count++
                if (count === promises.length) {
                    resolve(results)
                }
            })
        }
    })
}