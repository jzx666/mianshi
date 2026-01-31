// 题目 1：两数之和（基础哈希）
// 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出两个数，使它们的和等于目标值。要求：
// 实现函数 twoSum(nums, target)，返回这两个数的索引（数组索引从 0 开始）；
// 每种输入只会对应一个答案，且同一个元素不能使用两次；
// 时间复杂度要求 O (n)，空间复杂度 O (n)。

const twoSum = (nums, target) => {
    const map = new Map();//每个元素对应的索引
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {//判断字典是否存在跟当前元素的和等于target的元素
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
        console.log(map)
    }
    return [];
}

const nums = [9, 11, 2,15, 7,];
const target = 9;
console.log(twoSum(nums, target));