// 题目 2：Promise 链式调用与值透传
// 实现函数 asyncAdd(a, b)，要求：
// 接收两个数字 a、b，返回一个 Promise；
// Promise 成功时返回 a + b 的结果；
// 需通过 Promise 链式调用 实现（禁止直接 return Promise.resolve(a + b)），至少包含 2 次 then 调用。

/**
 * 异步加法函数，通过Promise链式调用实现
 * @param {number} a - 第一个加数
 * @param {number} b - 第二个加数
 * @returns {Promise<number>} 成功时返回a+b的结果
 */
function asyncAdd(a, b) {
    // 第一步：初始化Promise，先返回第一个加数a
    return Promise.resolve(a)
        // 第一次then：接收a，返回a + b的中间值（也可拆分计算，比如先加0再累加）
        .then((num) => {
            // 这里可以做任意中间处理，核心是传递最终需要计算的值
            return num + b;
        })
        // 第二次then：接收a+b的结果，直接透传（满足至少2次then的要求）
        .then((sum) => {
            // 可在此处添加额外逻辑（如验证结果、格式化等），最终返回求和结果
            return sum;
        });
}

// 测试用例
asyncAdd(3, 5)
    .then((result) => {
        console.log(result); // 输出 8
    })
    .catch((err) => {
        console.error(err);
    });

asyncAdd(10, -2)
    .then((result) => {
        console.log(result); // 输出 8
    });