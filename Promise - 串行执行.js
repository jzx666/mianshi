// Promise 串行执行
// 实现一个函数 promiseSerial(tasks)，接收一个返回 Promise 的函数数组 tasks，要求：
// 按数组顺序串行执行所有任务（前一个任务完成后，再执行下一个）；
// 所有任务完成后，返回按执行顺序排列的结果数组；
// 若任意一个任务失败，立即终止执行并 reject 错误信息；
// 禁止使用 async/await，仅用原生 Promise 实现。

const promiseSerial = (tasks) => {
  return tasks.reduce((acc, task) => {//acc上一次的结果,task当前任务
    return acc.then((result) => { 
      console.log(result)
      return task().then((res) => {
        result.push(res);
        return result;
      });
    });
  }, Promise.resolve([]));
};

const mockPromise = (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.8) {
        resolve(name + ":success");
      } else {
        reject(name + ":error");
      }
    }, Math.random);
  });
};

const tasks = [
  () => mockPromise("task1"),
  () => mockPromise("task2"),
  () => mockPromise("task3"),
];

promiseSerial(tasks)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });




  