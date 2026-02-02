
//题目4：JavaScript概念题 - 闭包与作用域
//分析以下代码，写出控制台输出的顺序和值：
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}

for (let j = 0; j < 5; j++) {
  setTimeout(function() {
    console.log(j);
  }, 1500);
}
//答案：5,5,5,5,5; 0,1,2,3,4
//解析：var 声明的变量是函数作用域（或全局作用域），不是块级作用域
//循环结束后 i 的值为 5
//所有的 setTimeout 回调共享同一个 i 变量
//1秒后执行回调时，都访问的是同一个 i，其值已经是 5

//let 声明的变量是块级作用域
//每次循环都会创建一个新的 j 变量（在循环块中）
//每个 setTimeout 回调都捕获了各自循环迭代时的 j 值
//这实际上是闭包的一种体现

//闭包的理解：
// 核心定义：
// 闭包（Closure）是指一个函数能够记住并访问其词法作用域，即使该函数在其词法作用域之外执行。
// 简单说：
// 函数内部定义的函数，可以访问外部函数的变量，即使外部函数已经执行完毕。

// 闭包的实际应用场景
// 数据封装和私有变量
// 模块模式
const createBankAccount = (initialBalance) => {
  let balance = initialBalance; // 私有变量
  
  return {
    deposit: (amount) => {
      balance += amount;
      console.log(`存入 ${amount}, 余额: ${balance}`);
    },
    withdraw: (amount) => {
      if (amount > balance) {
        console.log('余额不足');
        return;
      }
      balance -= amount;
      console.log(`取出 ${amount}, 余额: ${balance}`);
    },
    getBalance: () => {
      console.log(`当前余额: ${balance}`);
      return balance;
    }
  };
};

const account = createBankAccount(1000);
account.deposit(500);    // 存入 500, 余额: 1500
account.withdraw(200);   // 取出 200, 余额: 1300
console.log(account.balance); // undefined - 无法直接访问
