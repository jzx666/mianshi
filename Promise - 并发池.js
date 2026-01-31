// 题目 5：Promise 并发池（进阶版）
// 基于题目 2 的并发控制，升级实现一个 “可动态添加任务” 的 Promise 并发池 PromisePool 类：
// 类的构造函数接收limit（最大并发数）；
// 实现add(task)方法：添加一个返回 Promise 的任务函数，返回该任务的 Promise；
// 实现start()方法：启动并发池，开始执行任务；
// 实现onComplete(callback)方法：所有任务完成后触发回调；
// 要求：任务添加后不会立即执行，需调用start()才启动；并发数始终不超过limit。


class PromisePool {
  constructor(limit) {
    this.limit = Math.max(1, limit);
    this.taskQueue = [];
    this.runningCount = 0;
    this.isStarted = false;
    this.completeCallback = null;
  }

  add(task) {
    if (typeof task !== 'function') {
      throw new Error('task must be a function that returns a Promise');
    }

    return new Promise((resolve, reject) => {
      this.taskQueue.push({ task, resolve, reject });
      if (this.isStarted) {
        this._run(); // 仍调用_run，但_run内部会批量启动
      }
    });
  }

  start() {
    if (this.isStarted) return;
    this.isStarted = true;
    this._run();
  }

  onComplete(callback) {
    if (typeof callback === 'function') {
      this.completeCallback = callback;
    }
  }

  _run() {
    if (!this.isStarted || this.taskQueue.length === 0) {
      this._checkAllCompleted();
      return;
    }

    // 计算还能启动多少个任务：limit - 已运行数
    const availableSlots = this.limit - this.runningCount;
    // 一次性取出最多availableSlots个任务
    const tasksToRun = this.taskQueue.splice(0, availableSlots);

    // 批量启动这些任务
    tasksToRun.forEach(({ task, resolve, reject }) => {
      this.runningCount++;

        task().finally(() => {
          this.runningCount--;
          // 单个任务完成后，再次尝试批量补充任务
          this._run();
        });

    });
  }

  _checkAllCompleted() {
    if (this.taskQueue.length === 0 && this.runningCount === 0 && this.isStarted) {
      if (this.completeCallback) {
        this.completeCallback();
      }
      this.isStarted = false;
    }
  }
}


// 模拟异步任务，延迟随机（100-500ms）
function createTask(id) {
  const delay = Math.floor(Math.random() * 400) + 100;
  return () => new Promise((resolve) => {
    console.log(`任务${id}开始执行（延迟${delay}ms）`);
    setTimeout(() => {
      console.log(`任务${id}执行完成`);
      resolve(`任务${id}结果`);
    }, delay);
  });
}

// 创建并发池，limit=10
const pool = new PromisePool(3);

// 注册完成回调
pool.onComplete(() => {
  console.log('所有任务都执行完成了！');
});

// 添加10个任务
for (let i = 1; i <= 10; i++) {
  pool.add(createTask(i)).then(res => console.log(res));
}

// 启动并发池
console.log('启动并发池');
pool.start();
