# 1：ES6后的新特性

let const

箭头函数

模板字符串

解构赋值

函数参数默认值

扩展运算符号...

函数剩余参数

引入class关键字，支持面向对象编程

使用import和export进行模块化开发

promise

新的原始数据类型：Symbol，表示唯一值

迭代器和生成器

Map和Set

Proxy

Reflect

async/await

可选链操作符：?. 用于安全的访问嵌套对象的属性

空值合并操作符：?? 仅在左侧为null/undefined时返回右侧的值

BigInt

动态导入：import(path).then(callback)

globalThis：跨平台的访问当前环境的全局对象（浏览器/node/web worker）

String.prototype.matchAll：返回一个包含所有匹配正则表达式的结果的迭代器

Promise.allSettled

逻辑赋值操作符：x ||= 2; // x = x || 2；x &&= 3; // x = x && 3；x ??= 4; // x = x ?? 4

WeakRef 用于创建对对象的弱引用，FinalizationRegistry用于在对象被垃圾回收时执行回调。

# 2：数组排序

### **`Array.prototype.sort()`**

- 默认情况下，`sort()` 方法将数组元素转换为字符串，然后按字典序排序。

- 可以传入一个比较函数来自定义排序规则。

### **`Array.prototype.reverse()`**

- `reverse()` 方法用于反转数组元素的顺序。

### **`自定义排序算法`**

- 如果需要更复杂的排序逻辑，可以手动实现排序算法，如冒泡排序、快速排序等。

```ts
//冒泡
function bubbleSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

const arr = [3, 1, 4, 1, 5, 9];
bubbleSort(arr); // [1, 1, 3, 4, 5, 9]
//快排
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = arr.filter((el) => el < pivot);
    const right = arr.filter((el) => el >= pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
}

const arr = [3, 1, 4, 1, 5, 9];
quickSort(arr); // [1, 1, 3, 4, 5, 9]
```

### **`Array.prototype.toSorted()` (ES2023)**

- `toSorted()` 方法返回一个新数组，该数组是原数组的排序副本，不会修改原数组。

# 3：数组去重

### **使用 `Set`**

- `Set` 是一种集合数据结构，它只存储唯一值。将数组转换为 `Set` 可以自动去重，然后再转换回数组。

### 遍历数组，并将不重复的元素累积到一个新数组中

### 利用对象的键唯一性来去重，或者使用 `Map` 数据结构

# 4：数组遍历

### **`for` 循环**

### **`for...of` 循环**

- 直接遍历数组的值，语法简洁。

- 适用于不需要索引的场景。

### **`Array.prototype.forEach()`**

- 对数组的每个元素执行回调函数。

- 适用于需要对每个元素执行相同操作的场景。

- **注意**：`forEach` 无法使用 `break` 或 `return` 中断遍历。

### **`Array.prototype.map()`**

- 遍历数组并返回一个新数组，新数组的元素是回调函数的返回值。

- 适用于需要对数组元素进行转换的场景。

### **`Array.prototype.filter()`**

- 遍历数组并返回一个新数组，新数组包含满足条件的元素。

- 适用于需要筛选数组元素的场景。

### **`Array.prototype.reduce()`**

- 遍历数组并将数组元素累积为一个值。

- 适用于需要将数组元素汇总为一个结果的场景。

### **`Array.prototype.some()`**

- 遍历数组，检查是否至少有一个元素满足条件。

- 适用于需要快速判断数组中是否存在符合条件的元素的场景。

### **`Array.prototype.every()`**

- 遍历数组，检查是否所有元素都满足条件。

- 适用于需要判断数组中的所有元素是否都符合条件的场景。

### **`Array.prototype.find()`**

- 遍历数组，返回第一个满足条件的元素。

- 适用于需要查找数组中符合条件的第一个元素的场景。

### **`Array.prototype.findIndex()`**

- 遍历数组，返回第一个满足条件的元素的索引。

- 适用于需要查找数组中符合条件的第一个元素的索引的场景。

### **`for...in` 循环**

- 遍历数组的索引（或对象的键）。

- **注意**：`for...in` 会遍历数组的所有可枚举属性，包括原型链上的属性，因此不推荐用于数组遍历。

### **`Array.prototype.entries()`**

- 返回一个包含数组索引和值的迭代器。

- 适用于需要同时获取索引和值的场景。

### **`Array.prototype.keys()`**

- 返回一个包含数组索引的迭代器。

- 适用于只需要索引的场景。

### **`Array.prototype.values()`**

- 返回一个包含数组值的迭代器。

- 适用于只需要值的场景。

### **`while` 循环**

- 通过条件控制遍历数组。

- 适用于需要手动控制遍历过程的场景。

### **`Array.prototype.flatMap()` (ES2019)**

- 遍历数组并对每个元素执行回调函数，然后将结果扁平化。

- 适用于需要同时映射和扁平化数组的场景。

### **递归遍历**

- 使用递归函数遍历数组。

- 适用于需要深度遍历或处理嵌套数组的场景。

# 5：函数柯里化

通过高阶函数的思路，将一个多参数函数，通过固定某些参数，返回一个新的单参函数的过程
