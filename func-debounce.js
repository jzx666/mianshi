//防抖函数
//防抖（debounce）：触发事件后，延迟 n 毫秒执行回调；若在延迟期内再次触发，重置延迟时间，最终仅执行最后一次回调。
//节流（throttle）：触发事件后，立即执行一次回调；在接下来的 n 毫秒内，无论触发多少次，都不再执行，直到时间窗口结束，本质是 “稀释执行频率”。

function debounce(fn,time){
  let timer = null
  return function (...args) {
    if(!timer){
      timer = setTimeout(() => {
        fn.apply(this,args)
        timer = null
      }, time);
    }
  }
}

function fn1(text) {
  console.log(text)
}
const dFn1 = debounce(fn1,5000)

setInterval(() => {
  dFn1('执行了'+new Date().getSeconds())
}, 1000);

