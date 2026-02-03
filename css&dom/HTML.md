### 1. **HTML5 有哪些新特性？**

- **参考答案**：语义化标签（`<header>`、`<footer>`、`<article>`等）、多媒体支持（`<audio>`、`<video>`）、本地存储（`localStorage`、`sessionStorage`）、Canvas/SVG绘图、表单增强（`date`、`email`、`range`等输入类型）、Web Workers、地理定位（Geolocation API）等。

### 2. **`<!DOCTYPE html>`的作用是什么？**

- **参考答案**：声明文档类型为HTML5，确保浏览器以标准模式渲染页面。省略可能导致怪异模式（Quirks Mode），影响布局兼容性。

### 3. **HTML 中`defer`和`async`属性的区别？**

- **参考答案**：
  
  - **`async`**：脚本异步加载，下载完成后立即执行（可能阻塞渲染，顺序不保证）。
  
  - **`defer`**：脚本异步加载，但在DOM解析完成后按顺序执行。
  
  - 均用于优化页面加载性能。

### 4. **如何实现响应式图片？**

**使用 `<img>` 的 `srcset` 和 `sizes` 属性**

```html
<img 
  src="default.jpg" 
  srcset="small.jpg 480w, medium.jpg 1024w, large.jpg 1600w"
  sizes="(max-width: 600px) 480px, (max-width: 1200px) 1024px, 1600px"
  alt="响应式图片示例"
>
```

**使用 `<picture>` 元素**

```html
<picture>
  <!-- 视口宽度 ≥ 1200px 时加载 landscape.jpg -->
  <source media="(min-width: 1200px)" srcset="landscape.jpg">
  <!-- 视口宽度 ≥ 800px 时加载 portrait.jpg -->
  <source media="(min-width: 800px)" srcset="portrait.jpg">
  <!-- 默认图片（必填） -->
  <img src="default.jpg" alt="动态切换图片">
</picture>
```

**使用 CSS 的 `background-image` 和媒体查询**

```css
.banner {
  background-image: url("default.jpg");
  background-size: cover;
}

/* 视口宽度 ≤ 768px 时切换为小图 */
@media (max-width: 768px) {
  .banner {
    background-image: url("small.jpg");
  }
}
```

**使用 `image-set()`（CSS 的高分辨率适配）**

```css
.hero {
  background-image: url("standard.png");
  background-image: image-set(
    "standard.png" 1x,
    "retina.png" 2x
  );
}
```

**懒加载 + 响应式（性能优化）**

```html
无js方案
<img 
  src="placeholder-low-res.jpg" 
  data-src="real-image.jpg" 
  data-srcset="small.jpg 480w, large.jpg 1080w"
  loading="lazy" 
  alt="懒加载响应式图片"
> 
//loading="lazy"：浏览器会自动延迟加载图片直到它接近视口（Viewport）。
```

```tex
js方案
方案一：
使用 IntersectionObserver 监听图片是否进入视口。
加载后移除 lazyload 类并停止观察。
方案二：滚动事件监听（兼容性更好但性能较低）
```

```html
优化技巧
1：占位符策略,低质量图片/纯色 占位
<img 
  src="placeholder-20px-blur.jpg" 
  data-src="real-image.jpg" 
  loading="lazy"
> 

2：防止布局偏移
使用 width 和 height 属性固定图片占位空间
或通过 CSS 设置宽高比容器
.img-container {
  aspect-ratio: 16/9;
  background: #eee;
}

3： 临界加载优化
通过 rootMargin 提前加载（如距离视口 200px 时触发）：
new IntersectionObserver(entries => {/* ... */}, {
  rootMargin: "200px 0px" // 提前 200px 加载
});pt


```

```tex
检测懒加载效果
1:Lighthouse 审计：检查 "Defer offscreen images" 是否达标。
Lighthouse是由 Google 开发的开源自动化工具，用于分析和改进网页的质量，涵盖性能、
可访问性、最佳实践、SEO 和渐进式 Web 应用（PWA）等方面。

2:Chrome DevTools：
打开 Network 面板，筛选 "Img"。
滚动页面，观察图片是否按需加载。
查看 loading 属性是否生效（Elements 面板）。
```

### **5：HTML `data-*` 属性**

`data-*` 属性是 HTML5 引入的一种自定义数据存储机制，允许开发者在 HTML 元素上存储额外的信息，而不会影响页面渲染或语义。

用于存储自定义数据（如`data-user-id="123"`），可通过JavaScript（`element.dataset.userId`）或CSS访问，避免污染标准属性。

```css
/* 使用属性值作为内容 */
div[data-user-id]::after {
  content: " (ID: " attr(data-user-id) ")";
}
```

### 6. 如何优化网页的SEO？

- - 使用语义化标签；
  
  - 添加`<meta>`描述和关键词；
  
  - 合理使用`<title>`和`<h1>`~`<h6>`；
  
  - 为图片添加`alt`属性；
  
  - 确保URL可读性（如`/products/123`而非`/p?id=123`）。

### 7. **如何解决跨域请求问题？**

- **CORS**：服务器设置`Access-Control-Allow-Origin`响应头；

- **JSONP**：通过`<script>`标签跨域获取数据（仅限GET）；

- **代理服务器**：后端转发请求，服务端通信无同源限制；

- **HTML5 API**：`postMessage`跨窗口通信。

### **8. Web Components**

Web Components 是一套浏览器原生支持的组件化技术，允许开发者创建可复用的自定义 HTML 元素。

**Custom Elements（自定义元素）**

```js
class MyButton extends HTMLElement {
  constructor() {
    super();
    // 元素初始化逻辑
    this.textContent = 'Click me!';
    this.addEventListener('click', () => {
      console.log('Button clicked!');
    });
  }
  
  // 定义可观察的属性
  static get observedAttributes() {
    return ['disabled', 'size'];
  }
  
  // 属性变化回调
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name} changed from ${oldValue} to ${newValue}`);
  }
  
  // 元素插入DOM时调用
  connectedCallback() {
    console.log('Element added to DOM');
  }
  
  // 元素从DOM移除时调用
  disconnectedCallback() {
    console.log('Element removed from DOM');
  }
}

// 注册自定义元素
customElements.define('my-button', MyButton);
```

```html
<my-button disabled size="large"></my-button>
```

 **Shadow DOM（影子DOM）**

Shadow DOM 提供了封装能力，使组件的样式和行为与外部隔离。

```js
class MyCard extends HTMLElement {
  constructor() {
    super();
    
    // 创建Shadow Root（open模式允许外部访问）
    const shadow = this.attachShadow({ mode: 'open' });
    
    // 创建组件模板
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
          font-family: sans-serif;
        }
        
        .title {
          color: #333;
          font-size: 1.2em;
          margin-bottom: 8px;
        }
      </style>
      <div class="title"><slot name="title">Default Title</slot></div>
      <div class="content"><slot>Default content</slot></div>
    `;
    
    // 将模板内容克隆到Shadow DOM
    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('my-card', MyCard);
```

```html
<my-card>
  <span slot="title">Custom Title</span>
  <p>This is custom content</p>
</my-card>
```

**HTML Templates（HTML模板）**

`<template>` 标签允许声明可复用的HTML片段，这些内容在页面加载时不会渲染。

```html
<template id="user-card-template">
  <div class="user-card">
    <img class="avatar">
    <div class="info">
      <h3 class="name"></h3>
      <p class="email"></p>
    </div>
  </div>
</template>

<script>
  class UserCard extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById('user-card-template');
      const content = template.content.cloneNode(true);
      
      content.querySelector('.avatar').src = this.getAttribute('avatar');
      content.querySelector('.name').textContent = this.getAttribute('name');
      content.querySelector('.email').textContent = this.getAttribute('email');
      
      this.attachShadow({ mode: 'open' }).appendChild(content);
    }
  }
  
  customElements.define('user-card', UserCard);
</script>**
```

### **9. ARIA（无障碍访问）**

ARIA（Accessible Rich Internet Applications）是一组属性和技术，用于增强网页和Web应用的无障碍访问性，特别是对于动态内容和复杂UI组件。

**ARIA三大主要属性**

| 属性类型           | 作用         | 示例                     |
| -------------- | ---------- | ---------------------- |
| **Roles**      | 定义元素的类型或作用 | `role="navigation"`    |
| **Properties** | 描述元素的特征或关系 | `aria-required="true"` |
| **States**     | 描述元素的当前状态  | `aria-disabled="true"` |
