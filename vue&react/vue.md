# 1：vite原理

webpack会先打包，然后启动开发服务器，请求服务器时会直接给与打包结果
而vite是直接启动开发服务器，请求哪个模块再对该模块进行实时编译。

由于现代浏览器本身就支持ES module，会自动向依赖的Module发出请求。vite充分利用这一点，将开发环境下的模块文件，直接作为浏览器要执行的文件，而不是像webpack那样进行打包合并。

由于不需要打包（分析依赖，编译），因此启动很快。项目越复杂，模块越多，vite的优势越明显。

再HMR方面，当改动一个模块后，仅需要让浏览器重新请求该模块即可，不像webpack那样需要把该模块的相关依赖模块全部重新编译一次。

当要打包到生产环境时，vite使用传统的rollup进行打包，因此vite主要优势再开发阶段。
由于vite利用的是ES module，因此再代码中不可以使用commonjs

# 2：vue3效率的提升

> **静态提升**

- 模板编译时，没有绑定动态内容的元素节点，会被提升（初始化创建一次，后续渲染复用）

- 静态属性会被提升

```ts
//对于静态属性（如 class 或 style），Vue 3 也会进行提升，避免重复创建。
<div class="static-class" :class="dynamicClass">
  Content
</div> 
//编译后
const _hoisted_1 = { class: "static-class" }

function render(_ctx, _cache) {
  return (openBlock(), createBlock("div", {
    class: normalizeClass([_hoisted_1.class, _ctx.dynamicClass])
  }, "Content", 2 /* CLASS */))
} 
//_hoisted_1 是提升后的静态属性对象，后续渲染直接复用。
```

> **预字符串化**

将模板中的连续的大量的静态内容（即不依赖响应式数据的内容）提前转换为纯 HTML字符串，并在运行时直接插入到 DOM 中，从而减少虚拟 DOM 的创建和比对开销。

> **缓存事件处理函数**

Vue 3 引入了 **`cacheHandlers`** 选项，当启用（默认启动） `cacheHandlers` 时，Vue 3 会将事件处理函数缓存起来，只有在依赖的响应式数据发生变化时才会重新创建函数。这样可以减少不必要的函数创建和垃圾回收，提升性能。

```ts
import { compile } from 'vue';
const template = `<div @click="handleClick">Click me</div>`;
const { code } = compile(template, {
  cacheHandlers: true, // 默认就是 true
});
console.log(code);
//编译后
import { createVNode as _createVNode, openBlock as _openBlock, 
createBlock as _createBlock } from "vue";

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", {
    onClick: _cache[1]
             || (_cache[1] = ($event) => _ctx.handleClick($event))
  }, "Click me"));
}
//在 Vue 2 中，事件处理函数没有类似的缓存机制。每次重新渲染时，内联函数都会被重新
//创建，即使函数逻辑没有变化。
```

> **PatchFlag**

记录节点的变化类型（是属性还是内容还是啥），比如patchflag:1,代表该节点只有内容变化了

> **Block Tree**

将模板划分为多个 **Block**。每个 Block 是一个稳定的节点树，内部可能包含动态节点。在比对时，Vue 3 会以 Block 为单位进行处理，而不是逐个节点比对。

- 减少了比对的范围，提升了性能。

- 特别适合处理 `v-if`、`v-for` 等动态结构。
  
  ```ts
  <div v-if="show">
    <p>Static content</p>
    <p>{{ dynamicText }}</p>
  </div> 
  //整个 div 会被视为一个 Block，内部包含静态和动态节点。
  ```

> **Tree Flattening（树扁平化）**

对虚拟 DOM 树进行扁平化处理，将动态节点提升到父级 Block 中。这样可以减少嵌套层级，提升比对效率。

- 减少了虚拟 DOM 树的深度。

- 提升了比对性能。

```ts
<div>
  <p>Static content</p>
  <p>{{ dynamicText }}</p>
</div> 
//动态节点 {{ dynamicText }} 会被提升到父级 Block 中。
```

# 3：API和数据响应式的变化

> **去掉了 Vue 构造函数**

改为使用 **`createApp`** 工厂函数来创建应用实例。这是 Vue 3 的一个重要变化，目的是为了更好地支持 **Tree Shaking**（树摇优化）和 **模块化**，同时使 API 更加清晰和灵活。

```ts
//vue2
import Vue from 'vue';
new Vue({
  el: '#app',
  render: h => h(App),
});
//这种方式的问题在于：
//全局配置污染：通过 Vue.config 或 Vue.use 进行的全局配置会影响整个应用。
//Tree Shaking 不友好：Vue 2 的 API 是挂载在 Vue 构造函数上的，导致无法
//通过 Tree Shaking 移除未使用的代码。
//不够模块化：全局配置和插件机制不够灵活。
```

> **数据响应式的实现**

- 处理Proxy本身效率比Object.definePropty更高之外，由于不必递归遍历所有属性，而是直接得到一个Proxy。所以在vue3中，对数据的访问时动态的，当访问某个属性的时候，再动态获取和设置，这就极大提升了再组件初始阶段的效率。

- 同时，由于Proxy可以监控到成员的新增和删除，因此，vue3中新增/删除成员，索引访问等均可触发重新渲染。而这些在vue2中是难以做到的

> **组件实例API**

- `setup` 函数

`setup` 函数是 Vue 3 中 **组合式 API（Composition API）** 的核心，用于替代 Vue 2 中的 `data`、`methods`、`computed` 等选项。它提供了更灵活、更模块化的方式来组织组件逻辑，并且更好地支持 TypeScript 和代码复用。

`setup` 函数是组件逻辑的入口，它在组件实例创建之前执行，接收 `props` 和 `context（上下文对象，包含attrs，slots，emit）` 作为参数。

- 组合式 API（Composition API）

旨在解决 Vue 2 中选项式 API（Options API）在复杂组件中逻辑分散、难以维护的问题。组合式 API 通过提供更灵活、更模块化的方式来组织代码，使得逻辑复用和代码组织更加清晰。

# 4：模板中的变化

> **v-model**

在 Vue 2 中，`v-model` 是 `v-bind:value` 和 `v-on:input` 的语法糖，主要用于表单元素（如 `<input>`、`<textarea>` 等）和自定义组件。

```ts
<input :value="message" @input="message = $event.target.value" />
```

vue3中

**支持多个 `v-model` 绑定**

```tsx
<CustomComponent v-model:firstName="first" v-model:lastName="last" />
//默认的v-model,等价于v-model:modelVlue
//组件内部
props: ['firstName', 'lastName'],
emits: ['update:firstName', 'update:lastName']
//移除 了vue2`.sync` 修饰符
```

v-model修饰符

```tsx
//保留了vue2的这三个修饰符，去掉了.sync修饰符
//.lazy：将 input 事件改为 change 事件。
//.number：将输入值转换为数字。
//.trim：去除输入值两端的空格。


//自定义 v-model 修饰符
<CustomComponent v-model.capitalize="message" />
//组件内部
props: {
  modelValue: String,
  modelModifiers: { default: () => ({}) },
},
emits: ['update:modelValue'],
setup(props, { emit }) {
  function updateValue(value) {
    if (props.modelModifiers.capitalize) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    emit('update:modelValue', value);
  }
  return { updateValue };
}
//Vue 2 不支持直接自定义 v-model 修饰符，但可以通过手动实现类似功能。
<input :value="message" @input="handleInput" />
export default {
  data() {
    return {
      message: '',
    };
  },
  methods: {
    handleInput(event) {
      let value = event.target.value;
      // 自定义处理逻辑，例如首字母大写
      value = value.charAt(0).toUpperCase() + value.slice(1);
      this.message = value;
    },
  },
};
```

> **v-if v-for**

- 在 Vue 2 中，`v-for` 的优先级高于 `v-if`。
  
  这意味着如果同时使用 `v-if` 和 `v-for`，`v-for` 会先执行，然后 `v-if` 会对每个循环项进行判断。

- 在 Vue 3 中，`v-if` 的优先级高于 `v-for`。
  
  这意味着如果同时使用 `v-if` 和 `v-for`，`v-if` 会先执行，然后 `v-for` 会对满足条件的项进行循环。

- key的变化

        当使用template进行v-for循环时，把key放到<template>中，而不是子元素
        当使用v-if v-else-if v-else分支时，不需要再指定key，因为vue3会自动给每个分支一个唯一的key，即便要手动给，也要保证唯一key

> **Fragment**

Fragment 是一种虚拟的 DOM 元素，它本身不会渲染为实际的 DOM 节点，而是将其子节点直接插入到父节点中。在 Vue 3 中，Fragment 的主要作用是支持多根节点模板。

# 5：组件的变化

> **定义异步加载的组件**

```tsx
const com1 = definedAsyncComponent(() => import('组件路径'))
const com1 = definedAsyncComponent({
    loader: async () => {
        retrurn import('组件路径')
    },
    loadingComponent: Loading组件,
    errorComponent: {
        render(){
            return h(Error, '出错了')
        }
    }
})
```

> **修改组件渲染的位置（真实dom）**

```tsx
<Teleport to="css选择器">
    //这里是要渲染的组件
</Tleport>
//vue2实现
//通过 JavaScript 手动将元素插入到目标位置。
```

# 6：Reactivity Api（响应式API）

脱离组件的存在，可理解为跟vue没啥关系

> 获取响应式数据：

`reactive`：代理对象

`ref`：代理任何，会包装到value里；如果是对象，其会调用reactive进行深度代理；如果已经是代理了，会直接使用代理

`readonly`：创建只读响应式对象

```tsx
import { reactive, readonly } from 'vue';

const state = reactive({
  count: 0,
});

const readOnlyState = readonly(state);

// 尝试修改只读对象
readOnlyState.count++; // 会触发警告，且不会修改值
console.log(readOnlyState.count); // 输出 0 
//但可以跳过readOnlyState，直接修改state的值，那两个都会变
```

`computed`：计算属性，只读，响应式更新，缓存；可以更高效地管理派生数据，提升代码的可读性和性能。

> 监听数据变化

`watchEffect`：一开始会运行一次，微队列异步执行，依赖多次改变，只会执行一次

`watch`：一开始不会执行，除非imdiate:true，第一个参数必须是响应式数据 或者 函数

> 判断

`isProxy`，`isReactive`，`isReadonly`，`isRef`

> 转换

`toRef`：当需要将响应式对象的某个属性单独提取为 `ref` 时

```ts
import { reactive, toRef } from 'vue';
const state = reactive({
  count: 0,
});
// 将 state.count 转换为 ref
const countRef = toRef(state, 'count');
console.log(countRef.value); // 输出 0
// 修改 ref 的值会同步到原始对象
countRef.value++;
console.log(state.count); // 输出 1
```

`toRefs`：将响应式对象的所有属性转换为 ref

```ts
import { reactive, toRefs } from 'vue';
const state = reactive({
  count: 0,
  name: 'Vue 3',
});
// 将 state 的所有属性转换为 ref
const refs = toRefs(state);
console.log(refs.count.value); // 输出 0
console.log(refs.name.value); // 输出 'Vue 3'
// 修改 ref 的值会同步到原始对象
refs.count.value++;
console.log(state.count); // 输出 1
```

`unref`：如果传入的值是 `ref`，则返回其 `.value`；否则直接返回该值

```ts
import { ref, unref } from 'vue';
const countRef = ref(0);
console.log(unref(countRef)); // 输出 0
const plainValue = 10;
console.log(unref(plainValue)); // 输出 10
```

# 7：Composition Api（组合式API）

> setup

```ts
export default {
    setup(props, context) {
        //该函数再组件属性被赋值后立即执行，早于所有生命周期钩子函数
       //context：attrs,slots,emit
    }
}
//script setup
/*语法糖
宏函数 defineProps defineEmits，只在script setup里使用，无需导入，编译时有效，
运行时无。
作用是打包时生成props，emits
setup函数内的都直接放到script setup，顶层定义会自动导出
ref引用组件不能获得其内部属性（也不推荐这样做）
如果一定要拿到ref引用组件的内部属性
则要在组件内部使用expose暴露需要暴露的属性
在script setup使用宏函数difineExpose暴露*/
```

> 生命周期函数

```ts
/*beforeCreate, created    //vue3不再需要钩子，代码可直接置于setup中
beforeMount, mounted
beforeUpdate, updated
//vue2:beforeDestroy, destroyed,
//vue3:beforeUnmount, unmounted,

errorCaptured

//vue3新增：
renderTrached:函数，参数e是收集的的依赖对象（描述怎么收集的，收集了啥）
renderTriggered:函数，参数e是导致重新渲染的依赖*/
```

# 8：Pinia

> 使用

```ts
import { createPinia } from 'pinia'
const pinia = createPinia()
createApp(App).use(pinia)


//useCounterStore
import { defineStore } from 'pinia'

export useCounterStore = defineStore('storeID', {
    state: () => {
        return {
            num: 0
        }
    },
    getters: {
        doubleCount: (state) => state.num * 2
    },
    actions: {
        //同步方法
        increment() {
            this.num++
        },
        async asyncIncrement() {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            this.increment()
        }
    }
})

import { useCounterStore } from 'useCounterStore'
import { storeToRefs } from 'pinia'
const store = useCounterStore()
const { num, doubleCount } = storeToRefs(store)
const { increment, asyncIncrement } = store
//num可直接进行修改，num++等操作, 当然你也可以用action方法，建议统一使用action
```

> api

```ts
store.$reset() //重置
store.$patch({num: 2}) //修改一个或多个指定状态
```

> 添加插件扩展功能

```ts
/*为store添加新属性
定义store时增加新的选项
为store增加新的方法
包装现有的方法
改变甚至取消action
实现副作用，比如本地存储
仅应用插件于特定store*/

//自定义插件
import { createPinia } from 'pinia'
function MyPiniaPlugin() {
    return { name: 'jzx' }
}
const pinia = createPinia()
pinia.use(MyPiniaPlugin)
//在另一个文件中
const store = useStore()
store.name //jzx

//插件是一个函数，可以选择性的返回想要添加到store的属性。
//它接收一个可选参数，即context
export function myPiniaPlugin() {
    context.pinia  //pinia实例
    context.app   //vue应用
    context.store  //插件想扩展的store
    context.options  //defineStore的options
}
//给特定的仓库扩展内容
export function MyPiniaPlugin({store}) {
    if(store.$id === '仓库id'){
        return {
            name: 'jzx'
        }
    }
}
//重置仓库状态
export function MyPiniaPlugin({store}) {
    const state = deepClone(store.$state)
    store.reset = () => {
        store.$patch(deepClone(state))
    }
}

//第三方插件
```

> 最佳实践

```
1:选择pinia来进行状态管理
    相比vuex,pinia很轻量，大小只有1KB左右
    pinia即适配vue2又适配vue3
    vuex3适配vue2，vuex4适配vue3
2:避免直接操作store的状态
    虽然可以直接操作状态，但是最好还是通过对于的getters来读取，actions来修改
3:使用Typescript
    pinia本身就是使用ts编写的，因此能很自然的融入ts项目
4:将状态划分为多个模块
    vuex中，状态仓库拆分时安装的时嵌套的方式进行代码组织的
    pinia中，组织状态仓库的形式不在采用想vuex一样的嵌套而是采用扁平化的设计，
    每个状态仓库都是独立的。
```
