
// Promise 错误捕获
// 分析以下代码的输出结果，并说明不同错误捕获方式的差异：


Promise.resolve()
  .then(() => {
    throw new Error('error1');
  })
  .catch((err) => {
    console.log(err.message);
    return 'catch1';
  })
  .then((res) => {
    console.log(res);
    throw new Error('error2');
  })
  .catch((err) => {
    console.log(err.message);
  })
  .finally(() => {
    console.log('finally');
  });

  // 输出结果:
  // error1
  // catch1
  // error2
  // finally