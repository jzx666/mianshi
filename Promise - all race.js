// 实现 Promise.all/race 核心逻辑
// 选做其中一个（建议先实现 all）：
// 实现 myPromiseAll(promises)：功能与 Promise.all 一致，接收 Promise 数组，全部成功则返回结果数组，任一失败则立即返回失败原因；
// 实现 myPromiseRace(promises)：功能与 Promise.race 一致，接收 Promise 数组，返回第一个完成（成功 / 失败）的 Promise 的结果 / 错误。


const myPromiseAll = (promises) => {
    const result = Array(promises.length).fill(null);
    let resolvedCount = 0;

    return new Promise((resolve, reject) => {
        // 遍历每个元素，先通过 Promise.resolve 包装（处理非Promise入参）
        promises.forEach((promise, idx) => {
            Promise.resolve(promise) // 关键：包装非Promise值
                .then((res) => {
                    // 成功时记录结果
                    result[idx] = res;
                    resolvedCount++;
                    // 所有都成功时，resolve结果数组
                    if (resolvedCount === promises.length) {
                        resolve(result);
                    }
                })
                .catch((err) => {
                    // 只要有一个失败，立即reject（核心规范）
                    reject(err);
                });
        });
    });
};


const myPromiseRace = (promises) => {
    return new Promise((resolve, reject) => {
        // 标记是否已完成，避免多次触发resolve/reject
        let isSettled = false;

        promises.forEach((promise) => {
            Promise.resolve(promise) // 包装非Promise值
                .then((res) => {
                    // 仅第一个完成的Promise触发resolve
                    if (!isSettled) {
                        isSettled = true;
                        resolve(res);
                    }
                })
                .catch((err) => {
                    // 仅第一个失败的Promise触发reject
                    if (!isSettled) {
                        isSettled = true;
                        reject(err);
                    }
                });
        });
    });
};


const mockPromise = (name) => {
    const resPonseTime = Math.round(Math.random() * 1000, 0);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.2) {
                resolve(name + ':success; ' + resPonseTime + 'ms');
            } else {
                reject(name + ":fail; " + resPonseTime + 'ms');
            }
        }, resPonseTime);
    });
};

const arr = [
    mockPromise('task1'),
    mockPromise('task2'),
    mockPromise('task3'),
    mockPromise('task4')
];

// 测试 myPromiseAll（符合原生：有失败则立即reject，全成功则返回结果数组）
myPromiseAll(arr)
    .then(res => console.log('myPromiseAll success:', res))
    .catch(err => console.log('myPromiseAll fail:', err));

// 测试 myPromiseRace（符合原生：第一个完成的Promise决定最终状态）
myPromiseRace(arr)
    .then(res => console.log('myPromiseRace success:', res))
    .catch(err => console.log('myPromiseRace fail:', err));