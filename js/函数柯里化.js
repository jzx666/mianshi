

// 通用柯里化函数
function curry(fn) {
    return function curried(...args) {
        // 如果传递的参数数量足够，直接执行原函数
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        // 否则返回一个新函数，继续收集参数
        return function(...nextArgs) {
            return curried.apply(this, args.concat(nextArgs));
        };
    };
}