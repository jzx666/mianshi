// 题目 2：最长回文子串（动态规划核心题）
// 给定一个字符串 s，找出其中最长的回文子串（回文：正读和反读都一样的字符串，如 "aba"、"bb"）。要求：
// 实现函数 longestPalindrome(s)，返回最长回文子串；
// 若字符串为空，返回空字符串；若有多个长度相同的最长回文子串，返回任意一个；
// 必须使用动态规划思路实现，禁止使用中心扩展等其他方法。

//状态转移方程：dp[i][j] = dp[i+1][j-1];
function longestPalindrome(s) {
    // 处理边界：空字符串直接返回空
    if (s.length === 0) return "";
    
    const n = s.length;
    // 创建n*n的二维dp数组，初始值为false
    const dp = Array.from({ length: n }, () => Array(n).fill(false));

    let start = 0; // 最长回文子串的起始索引
    let maxLen = 1; // 最长回文子串的长度（默认至少为1）

    // 初始化：长度为1的子串都是回文
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }

    // 遍历子串长度（从2开始，到n结束）
    for (let len = 2; len <= n; len++) {
        // 遍历起始索引i，j = i + len - 1 为结束索引
        for (let i = 0; i < n - len + 1; i++) {
            const j = i + len - 1;

            if (s[i] === s[j]) {
                // 子串长度为2时，只要两端相等就是回文（如"bb"）
                if (len === 2) {
                    dp[i][j] = true;
                } else {
                    // 长度>2时，依赖内部子串是否为回文
                    dp[i][j] = dp[i+1][j-1];
                }

                // 更新最长回文子串信息
                if (dp[i][j] && len > maxLen) {
                    maxLen = len;
                    start = i;
                }
            }
        }
    }

    // 截取最长回文子串并返回
    return s.substring(start, start + maxLen);
}

// 测试用例
console.log(longestPalindrome("babad")); // 输出 "bab" 或 "aba"（均符合要求）
console.log(longestPalindrome("cbbd"));  // 输出 "bb"
console.log(longestPalindrome("a"));     // 输出 "a"
console.log(longestPalindrome(""));      // 输出 ""
console.log(longestPalindrome("ccc"));   // 输出 "ccc"
console.log(longestPalindrome("baab"));    // 输出 "baab"