# 1：React的事件系统

> 合成事件

React 使用**合成事件**来封装原生 DOM 事件。合成事件是 React 提供的跨浏览器事件对象，它是对浏览器原生事件的封装，提供了统一的 API 和行为。

react无法通过return false来组织默认行为；需要使用e.preventDefualt的方式来阻止

- **特点**：
  
  - 跨浏览器兼容性：React 确保事件在不同浏览器中的行为一致。
  
  - 事件池机制：React 会重用事件对象以提高性能。

> 事件处理函数的 `this` 绑定

在类组件中，事件处理函数需要绑定 `this`，否则函数内部的 `this` 会是 `undefined`。

```ts
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Clicked!', this);
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
//或者使用箭头函数，箭头函数的this默认情况指向上层作用域的this
```

> 事件池机制

- **React 16 及之前**：
  
  - 事件池机制是 React 事件系统的重要优化手段，但需要注意在异步代码中调用 `event.persist()`。

- **React 17 及之后**：
  
  - 事件池机制被移除，事件对象不会被重用，开发者无需再担心事件对象的属性被清空。

事件池机制是 React 对合成事件（Synthetic Event）的一种优化策略。React 会重用事件对象，而不是为每个事件创建一个新的事件对象。当一个事件回调执行完毕后，React 会将事件对象的属性清空，并将其放回事件池中，供后续事件使用.

**注意事项**：

- 如果需要异步访问事件对象，需要调用 `event.persist()` 来从事件池中移除该事件对象。

```ts
function handleClick(event) {
  event.persist(); // 保留事件对象
  setTimeout(() => {
    console.log('Event:', event);
  }, 1000);
}
```

> 事件委托

React 将所有事件委托到文档的根节点（React 17 之前是 `document`，React 17 及之后是 `root` 节点）。这种设计减少了内存占用，并提高了性能。

- **优点**：
  
  - 减少事件监听器的数量。
  
  - 动态添加或删除组件时无需手动管理事件监听器。

# 2：组件状态和数据传递

>  组件状态（State）

在类组件中，状态通过 `this.state` 定义，并通过 `this.setState()` 更新。

在函数组件中，使用 `useState` Hook 来定义和更新状态。

组件状态可能是异步的，如果需要基于之前的状态更新，可以使用函数形式：

> 组件数据传递

`父向子传递`：props；

`子向父传递`：调用父组件传递的函数，将数据传递回父组件；

`兄弟组件之间`：需要通过共同的父组件来实现；

`多个子组件共享同一状态`：状态提升（状态提升到共同的父组件中，通过props往下传）；

`跨组件数据传递`：当需要在多层嵌套组件之间传递数据时，可以使用 Context API。

# 3：生命周期

> 类组件

**挂载阶段（Mounting）组件被创建并插入到 DOM 中。**

- `constructor(props)`：组件实例创建时最先被调用，初始化组件的状态和绑定方法。
- `static getDerivedStateFromProps(nextProps, prevState)`：在组件挂载和更新时被调用，用于根据新的props值更新state。
- `render()`：用于渲染组件的 UI 结构。
- `componentDidMount()`：组件挂载完成后调用，适合执行副作用操作（如数据请求、DOM 操作）。

**更新阶段（Updating）组件的状态或 props 发生变化，触发重新渲染。**

- `static getDerivedStateFromProps(nextProps, prevState)`：同挂载阶段。
- `shouldComponentUpdate(nextProps, nextState)`：用于决定组件是否需要更新，返回 false 则阻止更新。
- `render()`：重新渲染组件。
- `getSnapshotBeforeUpdate(prevProps, prevState)`：在 DOM 更新前调用，用于捕获 DOM 信息（如滚动位置）。返回值会作为参数传递给 `componentDidUpdate`。
- `componentDidUpdate(prevProps, prevState, snapshot)`：在组件更新后调用，适合执行副作用操作。

**卸载阶段（Unmounting）组件从 DOM 中移除。**

- `componentWillUnmount()`：在组件卸载前调用，用于清理操作（如取消网络请求、清除定时器）。

> 函数组件

函数组件没有生命周期方法，但可以通过 `useEffect` Hook 实现类似的功能。

**挂载和更新**

```ts
import React, { useEffect } from 'react';
function MyComponent() {
  useEffect(() => {
    console.log('Component mounted or updated');
    return () => {
      console.log('Component will unmount or re-render');
    };
  }); // 每次渲染后都执行
}
```

**仅挂载**

```ts
useEffect(() => {
  console.log('Component mounted');
}, []); // 空依赖数组，仅在挂载时执行
```

**依赖更新**

```ts
useEffect(() => {
  console.log('Count updated');
}, [count]); // 仅在 count 变化时执行
```

# 4：一些属性

> **`ref`**

React 提供的一种特殊属性，用于直接访问 DOM 元素或类组件实例。可用于

- 直接操作 DOM 元素（如聚焦输入框、获取元素尺寸等）。

- 访问类组件的方法或属性。

类组件中：`ref` 通过 `React.createRef()` 创建。

函数组件中：`ref` 通过 `useRef` Hook 创建。

> **`ref` 转发（Ref Forwarding）**

一种将 `ref` 自动传递给子组件的技术。它通常用于以下场景：

- 需要在父组件中访问子组件的 DOM 元素。

- 封装高阶组件（HOC）时，需要将 `ref` 传递给被包裹的组件。

`React.forwardRef` 是一个高阶函数，用于将 `ref` 转发到子组件。

```ts
const MyInput = React.forwardRef((props, ref) => (
  <input type="text" ref={ref} {...props} />
));
function ParentComponent() {
  const inputRef = useRef(null);
  const focusInput = () => {
    inputRef.current.focus(); // 访问子组件的 DOM 元素
  };
  return (
    <div>
      <MyInput ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

> **PureComponent**

`PureComponent` 是 React 中的一个**类组件基类**，继承自 `React.Component`。它的主要特点是：

- 自动实现了 `shouldComponentUpdate` 方法，对 `props` 和 `state` 进行浅比较。

- 如果 `props` 和 `state` 没有变化，组件不会重新渲染。

```ts
import React from 'react';
class MyComponent extends React.PureComponent {
  render() {
    console.log('MyComponent rendered');
    return <div>{this.props.value}</div>;
  }
}
```

如果是函数式组件，使用React.memo函数制作纯组件

```ts
function comp (props) {
  rerurn <div>{props.a}</div>
}
export default React.memo(comp)

//memo原理
function memo (FuncComp) {
  return class Memo extends PureComponent {
    render() {
      return <>
        {FuncComp(this.props)}
      </>
    }
  }
}
```

> **Render Props**

Render Props 是一种模式，它通过将一个函数作为组件的 `props` 传递，来动态决定组件的渲染内容。这个函数通常命名为 `render`，但也可以是其他名称。

- **核心思想**：
  
  - 组件不直接渲染内容，而是通过调用 `props.render`（或其他函数属性）来渲染内容。
  
  - 父组件可以通过这个函数将数据或逻辑传递给子组件。

```ts
class Mouse extends React.Component {
  state = { x: 0, y: 0 };
  handleMouseMove = (event) => {
    this.setState({ x: event.clientX, y: event.clientY });
  };
  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
} 
function App() {
  return (
    <Mouse
      render={({ x, y }) => (
        <h1>
          The mouse position is ({x}, {y})
        </h1>
      )}
    />
  );
}
```

> **Portals**

将子组件渲染到 DOM 中的任意位置。通常用于处理模态框、弹出层、工具提示等需要脱离当前 DOM 结构的场景。

尽管 Portals 将组件渲染到 DOM 中的不同位置，但它仍然保留 React 的事件冒泡机制。这意味着在 Portals 中触发的事件会冒泡到 React 树中的父组件。

```ts
import React from 'react';
import ReactDOM from 'react-dom';
function Modal({ children }) {
  return ReactDOM.createPortal(
    <div className="modal">
      {children}
    </div>,
    document.getElementById('modal-root') // 目标节点
  );
}
```

# 5：错误边界

React 提供的一种机制，用于捕获子组件树中的 JavaScript 错误，并优雅地处理这些错误，防止整个应用崩溃。错误边界类似于 JavaScript 中的 `try-catch`，但它专门用于 React 组件。

- 只能捕获子组件树中的错误，无法捕获自身的错误。

- 只能捕获渲染期间、生命周期方法和构造函数中的错误，无法捕获以下错误：
  
  - 事件处理函数中的错误。
  
  - 异步代码（如 `setTimeout` 或 `Promise`）中的错误。
  
  - 服务端渲染中的错误。
  
  - 错误边界自身抛出的错误。
1. **`static getDerivedStateFromError(error)`**：
   
   - 在子组件抛出错误时调用。
   
   - 用于渲染备用 UI。
   
   - 必须返回一个状态对象，用于更新组件的状态。

2. **`componentDidCatch(error, errorInfo)`**：
   
   - 在子组件抛出错误时调用。
   
   - 用于记录错误信息（如发送到错误监控系统）。
   
   - 不会触发重新渲染。

```ts
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新状态，渲染备用 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 渲染备用 UI
      return <h1>Something went wrong.</h1>;
    }

    // 渲染子组件
    return this.props.children;
  }
} 


function BuggyComponent() {
  throw new Error('This is a test error!');
  return <div>Buggy Component</div>;
}

function App() {
  return (
    <ErrorBoundary>
      <BuggyComponent />
    </ErrorBoundary>
  );
}
```

# 6：渲染原理

> **React 渲染的流程**

**创建虚拟 DOM**： 根据组件的 `render` 方法生成虚拟 DOM 树

**协调**：将虚拟 DOM 树与真实 DOM（或旧虚拟dom） 进行比较，计算出需要创建、更新或删除的节点。

**提交**：将更新应用到真实 DOM 上，完成初始渲染

> **协调算法（Reconciliation）**

协调算法基于以下假设：

- **不同类型的组件会生成不同的树**：
  
  - 如果根节点的类型不同，React 会销毁旧树并创建新树。

- **相同类型的组件会复用实例**：
  
  - 如果组件的类型相同，React 会复用组件实例并更新其属性。

- **通过 `key` 标识子元素**：
  
  - 使用 `key` 来标识子元素，帮助 React 识别哪些元素是新增的、删除的或移动的。

类型包括：文本节点，空节点，数组节点，dom节点，组件节点（函数，类）

> **Fiber架构**

React 16 引入了 Fiber 架构，它是 React 渲染引擎的重写，旨在提高渲染性能和用户体验。

**Fiber 的核心特性**

- **增量渲染**：
  
  Fiber 将渲染任务拆分为多个小任务，可以分批次执行，避免长时间阻塞主线程。

- **优先级调度**：
  
  - Fiber 支持根据任务的优先级动态调整执行顺序，确保高优先级任务（如用户输入）能够及时响应。

- **暂停和恢复**：
  
  - Fiber 可以在渲染过程中暂停任务，并在稍后恢复执行。

**Fiber 的工作流程**

- **Render 阶段**：
  
  - React 遍历组件树，生成虚拟 DOM 并计算更新。
  
  - 这个阶段可以被中断和恢复。

- **Commit 阶段**：
  
  - React 将更新应用到真实 DOM 上。
  
  - 这个阶段是同步的，不能被中断。

> **React 渲染的优化**

函数组件

**`React.memo`**：缓存函数组件的渲染结果，避免不必要的重新渲染。

**`useMemo`  `useCallback`**： React Hooks，用于缓存值和函数，避免不必要的重新计算。

类组件

使用 `shouldComponentUpdate` 或 `PureComponent` 避免不必要的重新渲染。

当然还有很多其他优化细节，不一一说了

# 7：HOOK

> **Hooks简介**

****类组件的的问题：this指向问题，繁琐的生命周期，等

hook本质上就是一个函数，可以挂载任何功能，用于增强函数组件的功能，使之理论上可以成为类组件的替代品。

> **Hooks 的实现机制**

- Hooks 是基于链表实现的：
  
  - React 在内部维护一个链表，用于存储组件的所有 Hooks。
  
  - 每次调用 Hook（如 `useState`），React 会将 Hook 添加到链表中，并返回当前 Hook 的状态和更新函数。

- Hooks 的顺序必须一致：
  
  - React 依赖于 Hooks 的调用顺序来管理状态。因此，Hooks 不能在条件语句或循环中使用。

> 一些hook

- `usState`

原理

```ts
1：初始化状态
当组件首次渲染时，useState 会接收初始状态值，并将其存储在组件的 Fiber 节点中。
React 会为每个 useState 调用分配一个唯一的标识符（基于调用顺序），并将其与状态值
关联。
2：更新状态
当调用 setState 函数时，React 会将新的状态值存储在 Fiber 节点中，并标记组件需要
重新渲染。
React 会调度一次重新渲染，并在下一次渲染时使用新的状态值。
3：重新渲染
在重新渲染时，useState 会返回最新的状态值。
由于 React 使用链表来管理 Hooks，因此它能够准确地找到每个 Hook 的状态值。

以下是一个简化版的 useState 实现：
let state; // 存储状态值
let setters = []; // 存储更新函数
let cursor = 0; // 当前 Hook 的索引

function createSetter(cursor) {
  return function setter(newState) {
    state[cursor] = newState; // 更新状态
    render(); // 触发重新渲染
  };
}

function useState(initialState) {
  if (state === undefined) {
    state = []; // 初始化状态数组
  }

  if (state[cursor] === undefined) {
    state[cursor] = initialState; // 设置初始状态
  }

  if (setters[cursor] === undefined) {
    setters.push(createSetter(cursor)); // 创建更新函数
  }

  const currentState = state[cursor];
  const setState = setters[cursor];

  cursor++; // 移动到下一个 Hook
  return [currentState, setState];
}

function render() {
  cursor = 0; // 重置索引
  ReactDOM.render(<App />, document.getElementById('root'));
}
```

使用及其优化

```ts
//管理基本类型
const [state, setState] = useState(initialState);

//管理对象
const [form, setForm] = useState({
  name: '',
  email: '',
  password: '',
});
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};

//与useEffect结合，用于处理副作用
const [data, setData] = useState(null);
useEffect(() => {
  fetchData().then((response) => setData(response));
}, []);

//useState的性能优化
//1：如果状态的计算或更新逻辑较为复杂，可以使用 useMemo 和 useCallback 来优化性能
const memoizedValue = useMemo(() => computeExpensiveValue(count), [count]);
const memoizedCallback = useCallback(() => doSomething(count), [count]);
//2：在更新状态时，确保新值与旧值不同，避免触发不必要的重新渲染。
```

- `useEffect`

```ts
 useEffect(() => {
    //状态变化时，做一些副作用操作
   //可返回一个清理函数(会在组件卸载时调用，可用于清理定时或事件监听等)
  }, [依赖状态])

 //工作原理
 1 初始化副作用
当组件首次渲染时，useEffect会接收副作用函数和依赖数组，并将其存储在组件的 Fiber
节点中。
React 会为每个useEffect调用分配一个唯一的标识符（基于调用顺序），并将其与副作用
函数关联
2 执行副作用
在组件渲染完成后，React 会检查副作用函数的依赖数组。
如果依赖数组为空，或者依赖项发生了变化，React 会执行副作用函数。
3 清理副作用
如果副作用函数返回一个清理函数，React 会在组件卸载或依赖项变化时执行清理函数。

 以下是一个简化版的 useEffect 实现：
 let effectQueue = []; // 存储副作用函数
let cleanupQueue = []; // 存储清理函数
let cursor = 0; // 当前 Hook 的索引

function useEffect(effect, dependencies) {
  const currentEffect = effectQueue[cursor];
  const hasChanged = currentEffect
    ? dependencies.some((dep, i) => dep !== currentEffect.dependencies[i])
    : true;

  if (hasChanged) {
    if (currentEffect && currentEffect.cleanup) {
      currentEffect.cleanup(); // 执行清理函数
    }

    const cleanup = effect(); // 执行副作用函数
    effectQueue[cursor] = { effect, dependencies, cleanup }; // 存储副作用
  }

  cursor++; // 移动到下一个 Hook
}

function render() {
  cursor = 0; // 重置索引
  ReactDOM.render(<App />, document.getElementById('root'));
}
```

- `useReducer`

用于在函数组件中管理复杂的状态逻辑。它是 `useState` 的替代方案，特别适合处理包含多个子状态或状态之间存在复杂关系的场景。

```ts
export defual function(reducer,initState,initFunc) {

  const [state,setState] = useState(initFunc ?initFunc() : initState)

  function dispatch(){
    const newState = reducer(state,action)
    console.log('日志：xxxxxx')
    setState(newState)
  }

  return [state,dispatch]
}
```

- `useContext`

```ts
const ctx = React.createContext()

export defual function App() {
    return （
      <div>
        <ctx.Provider value="abc">
            <Test />
        </ctx.Provider>
    </div>
  ）
}

const Test() {
  const value = useContext(ctx)
  return <h1>Test,上下文的值：{value}</h1>
}
```

- `useCallback`

固定函数的引用，只要依赖项没有发生变化，则始终返回之前函数的地址

```ts
const handleClick = useCallback(() => {
  setTxt(txt + 1)
},[txt])
```

- `useMemo`

用于保持一些稳定的数据，通常用于性能优化,把高开销的计算放到useMemo，依赖项不变就不会重新计算

```ts
const handleClick = useMemo(
  return () => {
  setTxt(txt + 1)
},[txt])
```

- `useRef`

useRef(默认值)，返回一个对象{current：xx}

```ts
1 持久化数据
useRef 的值在组件的多次渲染之间保持不变，即使组件重新渲染，ref 对象的 current
 属性也不会被重置。
2 不会触发重新渲染
更新 ref 对象的 current 属性不会触发组件的重新渲染。这与 useState
 不同，useState 的状态更新会触发重新渲染。
3 访问 DOM 元素
useRef 最常见的用途是访问 DOM 元素。通过将 ref 对象传递给 
ref 属性，可以获取 DOM 元素的引用。


使用场景：访问 DOM 元素、存储可变值、避免重复渲染。
```

- `useImperativeHandle`

```ts
useImperativeHandle(ref,func,[依赖项])//func：返回值会赋值给ref.current

场景：func的返回值把method设置进去作为一个属性也可以，赋值给ref.current

就可以实现类似ref转发一样把函数组件内部的东西暴露给父组件使用；
ref转发暴露的是函数组件的dom；
这里暴露的是函数组件内部的方法，可以这样调用ref.current.method()
```

- `useLayoutEffect`

```ts
用法跟useEffect一样
useEffect：浏览器渲染完成后，用户看到新的渲染结果后
useLayoutEffect：完成了dom改动，但还没有呈现给用户

通常用于那些直接操作 DOM 并且会影响页面布局的操作，以避免在绘制过程中出现视觉上
的闪烁或不一致。

应该尽量使用useEffect，不会导致浏览器渲染阻塞
```

- `useDebugValue`

用于将自定义hook'的关联数据显示到调试栏

- `自定义hook`

# 8：React Router

使用

- react-router
  
  - 核心库

- react-router-dom
  
  - 利用核心库，结合实际页面，实现跟页面路由密切相关的功能

原理

- 第三方库：path-to-regexp
  
  - 用于将一个路径字符串转换为正则
  
  - 利用转换的结果拼装match对象

- 第三方库：history
  
  - createBrowserHistory：产生控制浏览器真实地址的history对象
  
  - createHashHistory：产生控制浏览器Hash的history对象
  
  - createMemoryHistory：产生控制内存中地址数组的history对象
  
  - 三个函数，返回的对象结构完全一致
  
  - 利用createBrowserHistory创建的history对象控制跳转行为 和 历史记录

- router组件提供上下文环境

- route组件根据匹配结果渲染对应组件

- switch组件：匹配route子元素，渲染第一个匹配到的route

- withRouter：用于将上下文中的数据作为属性注入

# 9：Redux

> 三个主要的板块

- action

它是一个平面对象（plain-object），{type:操作类型,payload:附加数据}

- reducer

一个数据仓库，有且仅有一个reducer；并且，通常情况，一个工程只有一个仓库；
因此一个系统，只有一个reducer，单独文件管理

- store

creatStore方法创建的对象

```ts
dispatch：分发action
getState：得到仓库中当前的状态
replaceReducer：替换当前的reducer
subscribe：注册一个监听器
监听器是一个无参函数，当分发了一个action之后，会运行注册的监听器；
返回一个函数，可以用于取消监听
可注册多个
    //订阅状态变化
store.subscribe(() => {
  console.log(store.getState())
}) 
//手写createStore
function(reducer,defualtState){
  let currentReducer = reducer,
             currentState = defulatState;

  const listeners = []

  function dispatch(action){
    if(!isPlainObject(action)){
      thow new TypeError("action must be an 
       PlainObject")
    }
    if(action.type === undefined){
      thow new TypeError("action must have 
      an property of type")
    }
    currentState = currentReducer(currentState,action)

    for(const listener of listeners){
      listener()
    }
  }

  function getState(){
    return currentState
  }

  function subscribe(listener){
    listeners.push(listener)
    return function(){
        const index = listeners.indexOf(listener)
        (index!==-1) &&  listeners.splice(index,1)
    }
  }

  //创建仓库时，分发一次初始化action
  dispath({
    type:`@@redux/INIT${}getRandomStr()`
  })

  return {
    dispatch,getState,subscribe
  }
}
```

- redux中间件

劫持dispatch，增强其功能，比如可加入数据日志等功能

```ts
//劫持就是再包一层函数，执行前后加入新的逻辑
let oldDispatch = store.diapatch
//中间件1
store.dispatch = function(){
    console.log(“改变前”，store.getState(),action)
    oldDispatch(action)
    console.log(“改变后”，store.getState())
}
//中间件2
store.dispatch = function(){
    console.log(“改变前”，store.getState(),action)
    oldDispatch(action)
    console.log(“改变后”，store.getState())
}

redux提供了applyMiddleware用于记录中间件，返回一个函数用于记录创建仓库的方法
中间件需要返回一个函数用于替换disptch
//next就是原始disptch 或者 上一个中间件返回的dispatch
//等所有中间件都加入后，才会去赋值给store.dispatch

function logger1(next) {
  return function(){
        console.log(“改变前”，store.getState(),action)
        next(action)
        console.log(“改变后”，store.getState())
  }
}
const store = createStore(reducer, applyMiddleware(logger1，logger2))
const store = applyMidware(logger1,logger2)(createStore)(reducer)  


//处理副作用的中间件
redux-thunk，redux-promise，redux-saga
```

# 10：react-redux

用来连接redux和react

```tsx
Provider组件
    没有ui界面，作用是将redux的仓库放到一个上下文中
    <Provider store="store">
      <div></div>
    </Provider>
connect组件
    高阶组件，用于连接仓库和组件的
    connect(mapStateToProps,mapDispatchToProps)(组件)
    mapStateToProps
        参数1：整个仓库的状态
        参数2：使用者传递的属性对象
    mapDispatchToProps
        情况一：函数
            参数1：dispatch函数
            参数2：使用者传递的属性对象
            返回的对象会作为属性传递到展示组件中（作为事件处理函数存在）
        情况二：对象，对象的每个属性是一个action创建函数；
            当事件触发时，会自动dispatch函数返回的action
```

# 11：umijs

### **1.1 开箱即用的路由**

- UmiJS 内置了基于文件系统的路由，无需手动配置路由规则。

- 支持动态路由、嵌套路由、权限路由等高级功能。

---

### **1.2 插件系统**

- UmiJS 提供了丰富的插件系统，允许开发者扩展框架的功能。

- 官方提供了许多插件，如 `@umijs/plugin-antd`（集成 Ant Design）、`@umijs/plugin-dva`（集成 Dva 状态管理）等。

---

### **1.3 状态管理**

- UmiJS 支持多种状态管理方案，如 Dva、Redux、MobX 等。

- 通过插件可以轻松集成这些状态管理工具。

Dva来自alibaba，不仅是一个第三方库，更是一个框架；它整合了redux的相关内容，让我们处理数据更加容易；
依赖react，react-router，redux，redux-saga，react-redux，connected-react-router等。

---

### **1.4 构建优化**

- UmiJS 基于 Webpack 5，提供了开箱即用的构建优化，如代码分割、Tree Shaking、缓存等。

- 支持按需加载、动态导入等高级功能。

---

### **1.5 开发体验**

- 提供了强大的开发工具，如热更新、Mock 数据、TypeScript 支持等。

- 支持多环境配置（开发、测试、生产）。

### 12：Fiber架构

React 的 **Fiber 架构**是 React 16 中引入的核心算法重构，旨在解决传统更新机制的性能瓶颈，支持**增量渲染**、**任务优先级调度**和**并发模式**。

---

**一、为什么需要 Fiber？**

在 React 16 之前，React 使用**递归遍历组件树**的更新机制（称为“Stack Reconciler”），但存在两大问题：

1. **不可中断性**：递归一旦开始，必须一次性完成，导致长时间占用主线程，造成界面卡顿（如复杂组件树更新时）。

2. **无优先级控制**：所有更新任务平等竞争，高优先级操作（如用户交互）无法及时响应。

Fiber 架构通过**可中断的异步渲染**和**任务优先级调度**，解决了这些问题。

---

**二、Fiber 的核心思想**

1. **增量渲染（Incremental Rendering）**  
   将更新任务拆分为多个小任务（Fiber 节点），允许在浏览器空闲时段分片执行，避免阻塞主线程。

2. **任务优先级调度**  
   为不同任务分配优先级（如用户输入 > 动画 > 数据加载），高优先级任务可中断低优先级任务。

3. **并发模式（Concurrent Mode）**  
   支持同时处理多个更新任务，通过暂停/恢复机制实现更流畅的交互体验。

---

**三、Fiber 的数据结构**

每个 React 元素（组件、DOM 节点）对应一个 **Fiber 节点**，组成**链表树结构**。Fiber 节点包含以下关键信息：

```js
{
  type: ComponentType | 'div',  // 组件类型或 DOM 标签
  key: string,                  // 唯一标识
  stateNode: ComponentInstance | DOMNode, // 组件实例或 DOM 节点
  return: Fiber | null,         // 父节点
  child: Fiber | null,          // 第一个子节点
  sibling: Fiber | null,        // 下一个兄弟节点
  pendingProps: Props,          // 待处理的 props
  memoizedProps: Props,         // 当前的 props
  memoizedState: State,         // 当前的 state
  effectTag: SideEffectType,    // 标记副作用（如插入、更新、删除）
  nextEffect: Fiber | null,     // 下一个有副作用的节点
  // ... 其他如优先级（lanes）、alternate（双缓存指针）等
}
```

---

**四、Fiber 的工作流程：两大阶段**

Fiber 的更新分为 **Reconciliation（协调）** 和 **Commit（提交）** 两个阶段：

1. **Reconciliation 阶段（可中断）**
- **目标**：找出需要更新的节点，构建 **Effect List**（记录副作用的链表）。

- **过程**：
  
  - **遍历 Fiber 树**：从根节点开始，深度优先遍历，生成新的 Fiber 树（workInProgress 树）。
  
  - **Diff 算法**：对比新旧 Fiber 节点，标记变更（如 `Placement`、`Update`、`Deletion`）。
  
  - **收集副作用**：将有变更的节点链接到 Effect List。

- **特点**：可中断，通过 `requestIdleCallback` 或 React 调度器在空闲时间执行。
2. **Commit 阶段（不可中断）**
- **目标**：同步执行所有副作用（DOM 更新、生命周期回调等）。

- **过程**：
  
  - **操作 DOM**：根据 Effect List 插入、更新或删除节点。
  
  - **调用生命周期**：执行 `componentDidMount`、`componentDidUpdate` 等。
  
  - **更新引用**：切换 `current` 树和 `workInProgress` 树（双缓冲机制）。

- **特点**：必须一次性完成，避免用户看到中间状态。

---

**五、Fiber 的关键技术**

1. **双缓冲（Double Buffering）**  
   维护两棵 Fiber 树：`current`（当前显示）和 `workInProgress`（正在构建）。更新完成后，`workInProgress` 替换为 `current`，减少内存分配成本。

2. **优先级调度（Lane Model）**  
   通过 **lanes** 模型管理任务优先级，高优先级的更新（如用户输入）可抢占低优先级任务。
   
   Lane 模型
   
   - **Lane（赛道）**：每个更新任务分配一个优先级（如 `SyncLane`、`InputContinuousLane`、`DefaultLane`）。
   
   - **合并与抢占**：高优先级任务可以“抢占”低优先级任务的执行权，中断并重新开始渲染。

3. **时间切片（Time Slicing）**  
   将任务分割为 5ms 左右的小块，在浏览器空闲时间执行，通过 `shouldYield()` 判断是否需要中断。
   
   调度器（Scheduler）
   
   - **时间切片（Time Slicing）**：将任务拆分为 5ms 的小块，通过 `messageChannel` 或 `setTimeout` 在空闲时间执行。
   
   - **任务队列**：根据优先级排序任务，高优先级任务优先处理。
   
   - **中断逻辑**：使用 `shouldYield()` 函数判断是否需要让出主线程。
   
   ```js
   // 伪代码：任务调度循环
   function workLoop(deadline) {
     while (currentTask && !shouldYield()) {
       performUnitOfWork(currentTask); // 处理单个 Fiber 节点
     }
     if (currentTask) {
       requestIdleCallback(workLoop); // 继续调度剩余任务
     }
   }
   ```

---

**六、Fiber 带来的新特性**

1. **并发模式（Concurrent Mode）**  
   支持同时处理多个更新任务，如中断低优先级的渲染以响应用户输入。

2. **Suspense**  
   允许组件等待异步数据，在等待期间显示 fallback UI。

3. **自动批处理（Batching）**  
   将多个状态更新合并为一次渲染，减少重复计算。

---

**七、关键代码流程示例**

```js
// 1. 触发更新（如 setState）
scheduleUpdateOnFiber(root, fiber, lane);

// 2. 调度器分配任务
ensureRootIsScheduled(root);

// 3. Render 阶段遍历 Fiber 树
performUnitOfWork(fiber) {
  beginWork(fiber); // 处理组件，生成子 Fiber
  if (fiber.child) return fiber.child;
  while (fiber) {
    completeWork(fiber); // 完成节点，收集副作用
    if (fiber.sibling) return fiber.sibling;
    fiber = fiber.return;
  }
}

// 4. Commit 阶段
commitRoot(root);
```

**八、总结：Fiber 的优势**

| **传统 Stack Reconciler** | **Fiber Reconciler** |
| ----------------------- | -------------------- |
| 递归不可中断，阻塞主线程            | 可中断异步渲染，避免卡顿         |
| 无优先级控制                  | 基于优先级的任务调度           |
| 无法实现并发更新                | 支持并发模式，提升复杂应用性能      |
