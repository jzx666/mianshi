// 算法题 - 深拷贝函数
// 实现一个通用的深拷贝函数 deepClone(target)，要求：
// 支持拷贝基本数据类型（number/string/boolean/null/undefined/symbol/bigint）；
// 支持拷贝引用类型：数组、普通对象（不含原型链属性）、Date、RegExp；
// 处理循环引用问题（如 obj.a = obj，拷贝后不报错且能正确复制）；
// 不考虑函数、Map、Set 等复杂类型，聚焦核心深拷贝逻辑。

function deepClone(target, cache = new WeakMap()) {
  if (typeof target === "object" && target !== null) {
    // 处理循环引用：如果缓存中已有该对象，直接返回缓存的拷贝结果
    if (cache.has(target)) {
      return cache.get(target);
    }

    let cloneResult;
    if (target instanceof Date) {
      cloneResult = new Date(target.getTime());
      cache.set(target, cloneResult);
      return cloneResult;
    } else if (target instanceof RegExp) {
      //new RegExp(target) 仅能拷贝 source（匹配规则），会丢失 flags（修饰符）；
      //new RegExp(target.source, target.flags) 能同时拷贝规则和修饰符，实现正则的完整深拷贝。
      cloneResult = new RegExp(target.source, target.flags);
      cache.set(target, cloneResult);
      return cloneResult;
    } else if (Array.isArray(target)) {
      cloneResult = [];
      cache.set(target, cloneResult);
      for (let i = 0; i < target.length; i++) {
        cloneResult[i] = deepClone(target[i], cache);
      }
      return cloneResult;
    } else {
      cloneResult = {};
      cache.set(target, cloneResult);
      for (let key in target) {
        cloneResult[key] = deepClone(target[key], cache);
      }
      return cloneResult;
    }
  } else {
    return target;
  }
}


//测试用例
const obj = {
  name: "John",
  age: 30,
  date: new Date(),
  regex: /hello/,
  arr: [1, 2, 3],
  obj: {
    a: 1,
    b: 2,
  },
  sayHi: function () {
    console.log("Hi! " + this.name);
  },
};



const clonedObj = deepClone(obj);
//const clonedObj = JSON.parse(JSON.stringify(obj));
//const clonedObj = Object.assign({}, obj);

obj.name = "Alice";
obj.obj.b = 333;
clonedObj.sayHi();
console.log(obj);
console.log(clonedObj);

//为什么不直接用 JSON.parse(JSON.stringify(obj))？
//因为这样会丢失函数、Symbol、Map、Set 等复杂类型的数据。

//为什么不用Object.assign()？
//Object.assign() 只做浅克隆，对于嵌套对象会出问题
//深克隆需要特殊处理各种数据类型和循环引用

//const pohone = new RegExp( /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/, 'g' );
