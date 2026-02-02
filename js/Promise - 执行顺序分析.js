// Promise 执行顺序分析
// 分析以下代码的输出顺序，并解释原因：

console.log('start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise1');
  })
  .then(() => {
    console.log('promise2');
  });

console.log('end');

// 输出顺序：start，end，promise1，promise2，setTimeout
//同步代码优先执行：主线程先执行所有同步代码，直到执行栈为空。
//微任务（Microtask）：同步代码执行完后，立即执行所有微任务队列中的任务（Promise 的 then/catch/finally 属于微任务）。
//宏任务（Macrotask）：微任务队列清空后，再执行宏任务队列中的任务（setTimeout/setInterval/UI 事件等属于宏任务）。