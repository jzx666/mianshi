// **开发者使用角度：**
// 1. **API 设计**：Vue2 使用 Options API（data、methods 分离），Vue3 引入 Composition API（setup 函数，逻辑复用更灵活）。
// 2. **生命周期**：Vue3 生命周期钩子改为 `onXxx` 形式（如 `onMounted`），`beforeDestroy` 和 `destroyed` 更名为 `onBeforeUnmount` 和 `onUnmounted`。
// 3. **模板特性**：Vue3 支持多根节点模板，`v-model` 可多个使用，指令 API 变化。
// 4. **组件**：Vue3 新增 `<Teleport>`（传送组件）和 `<Suspense>`（异步组件加载状态）。
// 5. **全局 API**：Vue3 使用 `createApp()` 创建应用实例，全局 API 改为实例方法（如 `app.component`），避免全局污染。
// 6. **TypeScript**：Vue3 提供更好的 TypeScript 支持，类型推断更完善。

// **框架底层实现角度：**
// 1. **响应式系统**：Vue2 使用 `Object.defineProperty`（无法检测对象属性增删和数组索引变化），Vue3 使用 `Proxy`（全面代理，支持所有响应式操作）。
// 2. **编译优化**：Vue3 编译时进行静态节点提升、补丁标记（PatchFlag）、树结构拍平，减少运行时 diff 开销。
// 3. **代码结构**：Vue3 采用 monorepo 管理，模块化更好，支持 tree-shaking，打包体积更小。
// 4. **虚拟 DOM**：Vue3 重构虚拟 DOM，优化 diff 算法，性能更高。
// 5. **自定义渲染器**：Vue3 暴露更灵活的渲染器 API，便于非 DOM 环境（如小程序、Canvas）使用。