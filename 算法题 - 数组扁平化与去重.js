//题目1：算法题 - 数组扁平化与去重
//编写一个函数，接受一个包含嵌套数组的数组作为参数，返回一个扁平化且去重后的新数组，结果需要按数字大小升序排列。
//
//示例：
//
//javascript
//输入: [[1, 2, 2], [3, 4, [5, 6]], [7, [8, [9, 10]]]]
//输出: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function flattenAndUnique(arr) {
    const res = []
    function flatten(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                flatten(arr[i])
            } else {
                res.push(arr[i])
            }
        }
    }
    flatten(arr)
    return [...new Set(res)].sort((a, b) => a - b)
}

const arr = [[1, 2, 2], [3, 4, [5, 6]], [7, [8, [9, 10]]]]

console.log(flattenAndUnique(arr))


// 算法题 - 数组扁平化与降维
// 实现一个通用函数 flatten(arr, depth)，接收一个多维数组 arr 和可选参数 depth（降维深度，默认 Infinity）：
// 将多维数组降维到指定深度（如 depth=1，仅降一维；depth=Infinity，完全扁平化）；
// 处理边界：非数组返回原数据，空数组返回空数组；
// 示例：flatten ([1, [2, [3, 4]], 5], 1) → [1, 2, [3, 4], 5]；flatten ([1, [2, [3]]]) → [1, 2, 3]。

const flatten = (arr, depth = Infinity) => {
    const res = []

    function helper(arr, depth) {
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i]) && depth > 0) {
                helper(arr[i], depth - 1)
            } else {
                res.push(arr[i])
            }
        }
    }
    helper(arr, depth)
    return res
}