// 不同路径（中等难度）
// 一个机器人位于一个 m x n 网格的左上角。机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角。问总共有多少条不同的路径？
// 要求
// 实现函数 uniquePaths(m, n)，返回不同路径的总数；
// 必须使用动态规划思路实现，禁止使用排列组合公式等数学方法；
// 处理边界：m 和 n 均为正整数（范围 1 ≤ m, n ≤ 100）；
// 示例：
// 输入：m = 3, n = 7 → 输出：28
// 输入：m = 3, n = 2 → 输出：3
// 输入：m = 1, n = 1 → 输出：1
// 提示（仅引导思路，不涉及答案）
// 状态定义：思考 dp[i][j] 代表从起点到 (i,j) 位置的路径数；
// 状态转移：到达 (i,j) 只能从「上方 (i-1,j)」或「左方 (i,j-1)」来；
// 边界初始化：第一行 / 第一列的路径数有什么规律？

//状态转移方程：dp[i][j] = dp[i-1][j] + dp[i][j-1]

const uniquePaths = (m, n) => {
    if (m < 1 || n < 1) return 0;

    // 初始化二维dp数组
    const dp = Array.from({ length: m }, () => Array(n).fill(1)); // 提前初始化第一行/第一列为1

    // 只需遍历i>0且j>0的位置
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }

    return dp[m - 1][n - 1];
};

console.log(uniquePaths(3, 7)); // 28
console.log(uniquePaths(3, 2)); // 3
console.log(uniquePaths(1, 1)); // 1
