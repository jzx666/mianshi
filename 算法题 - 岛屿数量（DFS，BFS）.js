// 题目 5：岛屿数量（DFS/BFS）
// 给定一个由 '1'（陆地）和 '0'（水）组成的二维网格 grid，计算岛屿的数量。岛屿的定义：由相邻的陆地（水平 / 垂直相邻，斜向不算）组成，被水包围，且每个岛屿只能由 1 组成。要求：
// 实现函数 numIslands(grid)，返回岛屿数量；
// 处理边界：空网格返回 0，单行 / 单列网格需正确计算；
// 可使用 DFS 或 BFS 思路实现，禁止修改原网格数据。 

// DFS核心思想：标记当前陆地及其相邻陆地为已访问，递归处理未访问的相邻陆地，直到没有未访问的陆地为止。出现新的陆地时，岛屿数量加 1。
function numIslands(grid) {
    // 边界处理：空网格直接返回0
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }

    const rows = grid.length; // 网格行数
    const cols = grid[0].length; // 网格列数
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false)); // 访问标记矩阵
    let count = 0; // 岛屿数量

    // 定义DFS函数：标记当前陆地及其相邻陆地为已访问
    const dfs = (i, j) => {
        // 终止条件：1.坐标越界 2.不是陆地 3.已访问过
        if (
            i < 0 || i >= rows || 
            j < 0 || j >= cols || 
            grid[i][j] !== '1' || 
            visited[i][j]
        ) {
            return;
        }

        // 标记当前单元格为已访问（核心：不修改原网格，仅标记访问矩阵）
        visited[i][j] = true;

        // 递归访问上下左右四个方向
        dfs(i - 1, j); // 上
        dfs(i + 1, j); // 下
        dfs(i, j - 1); // 左
        dfs(i, j + 1); // 右
    };

    // 遍历整个网格
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // 找到未访问的陆地 → 新岛屿
            if (grid[i][j] === '1' && !visited[i][j]) {
                count++;
                dfs(i, j); // 标记该岛屿所有陆地为已访问
            }
        }
    }
    console.log(visited)
    return count;
}

// 测试用例
// 测试用例1：基础网格
const grid1 = [
    ["1","1","0","0","0"],
    ["1","1","0","0","0"],
    ["0","0","1","0","0"],
    ["0","0","0","1","1"]
];
console.log(numIslands(grid1)); // 输出 3

// 测试用例2：空网格
const grid2 = [];
console.log(numIslands(grid2)); // 输出 0

// 测试用例3：单行网格
const grid3 = [
    ["1","0","1","1","0"]
];
console.log(numIslands(grid3)); // 输出 2

// 测试用例4：单列网格
const grid4 = [
    ["1"],
    ["0"],
    ["1"],
    ["1"]
];
console.log(numIslands(grid4)); // 输出 2