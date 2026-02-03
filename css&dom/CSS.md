### **1：盒模型**

css盒模型有content，padding，border，margin组成，通过box-sizing属性切换，content-box：宽度仅包含content。

border-box：宽度包含content，padding，border（更常用）。

### **2：如何实现元素水平垂直居中？**

```css
//1：flex方案：
.parent {
  display: flex;
  justify-content: center;/* 垂直居中 */
  align-items: center;/* 水平居中 */
} 

//2：grid方案：
.parent {
  display: grid;
  place-items: center;/* 垂直居中*/
}

//3：绝对定位+transform（兼容旧浏览器）
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 通过自身宽高反向偏移 */
}  

//4：Table-Cell 方案（传统方法）
.parent {
  display: table-cell;
  text-align: center;     /* 水平居中 */
  vertical-align: middle; /* 垂直居中 */
}
.child {
  display: inline-block; /* 行内块元素才能生效 */
}

//5：Margin: Auto（需配合绝对定位）
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100px;
  height: 100px;
} 
//现代项目：优先用 Flexbox 或 Grid（代码简洁）。
//兼容旧浏览器：用 绝对定位 + Transform 或 Table-Cell。
//已知元素尺寸：可考虑 Margin 负值 或 Margin: Auto。
```

### **3：什么是BFC（块级格式化上下文）？如何触发？**

BFC是**css渲染过程中的一个独立的布局环境**，它决定了元素如何定位，如何与其他元素交互，以及如何计算外边距margin，折叠等问题。

**BFC 内的元素布局不受外部影响，同时也不会影响外部的布局。主要特性包括：**

- 内部元素垂直排列（默认情况下）。

- BFC 内的盒子会在垂直方向上一个接一个放置。

- 同一个 BFC 内的相邻块级元素会发生外边距折叠（Margin Collapse）。

- BFC 区域不会与浮动元素（float）重叠。

- BFC 可以包含浮动元素（解决高度塌陷）。

- BFC 可以阻止元素被浮动元素覆盖。

**满足以下任意条件即可创建 BFC：**

- 根元素（`<html>`）（默认就是 BFC）。

- 浮动元素（`float: left/right`，但不能是 `none`）。

- 绝对定位元素（`position: absolute/fixed`）。

- `display: inline-block`、`table-cell`、`flex`、`grid` 等。

- `overflow` 不为 `visible`（如 `overflow: hidden/auto/scroll`）。

**BFC 的常见应用场景**

解决外边距折叠（Margin Collapse）

```tsx
问题：相邻块级元素的上下 margin 会合并（取较大值）。
解决：让它们处于不同的 BFC 中。
<div class="box1">Box 1</div>
<div class="box2">Box 2</div> 

.box1 {
  margin-bottom: 20px;
}
.box2 {
  margin-top: 30px; /* 实际间距是 30px（不是 50px） */
} 
解决方案：
<div class="bfc-container">
  <div class="box1">Box 1</div>
</div>
<div class="box2">Box 2</div> 

.bfc-container {
  overflow: hidden; /* 触发 BFC，阻止 margin 合并 */
}
```

清除浮动（防止父元素高度塌陷）

```tsx
问题：子元素浮动后，父元素高度会塌陷（高度为 0）。
解决：让父元素触发 BFC，使其包含浮动元素。 

<div class="parent">
  <div class="float-child">浮动元素</div>
</div> 
.float-child {
  float: left;
}
.parent {
  overflow: hidden; /* 触发 BFC，父元素能正确计算高度 */
} 
//伪元素清除法（推荐）：
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

避免浮动元素覆盖非浮动元素

```tsx
问题：浮动元素会脱离文档流，可能覆盖后面的非浮动元素。
解决：让非浮动元素触发 BFC，使其不与浮动元素重叠。 
<div class="float-box">浮动元素</div>
<div class="normal-box">普通元素</div> 
.float-box {
  float: left;
  width: 100px;
  height: 100px;
}
.normal-box {
  overflow: hidden; /* 触发 BFC，避免被浮动元素覆盖 */
}
```

### **4:css动画**

**`transition`**：简单过渡（如悬停效果）。

```css
.box { transition: all 0.3s ease; }
```

**`@keyframes` + `animation`**：关键帧动画/复杂动画。

```css
@keyframes slide {
  0% { transform: translateX(0); }
  50% { transform: translateX(100px); }
  100% { transform: translateX(0); }
}
.box {
  animation: slide 2s ease-in-out infinite;
} 
```

### **5：移动端 1 像素边框问题**

在移动端开发中，由于 **Retina 屏幕（高 DPI 设备）** 的物理像素比逻辑像素（CSS 像素）更高，直接设置 `border: 1px` 会导致实际显示的边框比设计稿更粗（通常是 2 物理像素或更多）。

**问题原因**

- **设备像素比（DPR, Device Pixel Ratio）**：
  
  - 普通屏幕（DPR = 1）：1 CSS 像素 = 1 物理像素。
  
  - Retina 屏幕（DPR ≥ 2）：1 CSS 像素 = 2 或 3 物理像素。

- **直接写 `border: 1px`**：
  
  - 在 DPR=2 的设备上，实际渲染为 2 物理像素，看起来更粗。

**解决方案**

**（1）使用 `transform: scale()` 缩放（推荐）**

**（2）`viewport` + `rem` 方案**

**原理**：动态调整 `viewport` 的 `initial-scale`，使 `1px` 直接对应 1 物理像素。  
**适用场景**：全局适配（需结合 JS）。

       **优点：**

- 直接写 `1px` 即可，无需额外 CSS 代码。  
  **缺点**：

- 需要动态计算 `viewport`，可能影响页面缩放。

```html
<meta 
name="viewport" 
id="viewport" 
content="width=device-width, 
    initial-scale=1, 
    maximum-scale=1, 
    minimum-scale=1, 
    user-scalable=no"
>
<script>
  const dpr = window.devicePixelRatio || 1;
  const scale = 1 / dpr;
  const meta = document.querySelector('meta[name="viewport"]');
  meta.setAttribute('content',  
    `width=device-width,  
    initial-scale=${scale},  
    maximum-scale=${scale},  
    minimum-scale=${scale},  
    user-scalable=no`);
</script>
```

```css
html {
  font-size: calc(100vw / 7.5); /* 设计稿 750px → 1rem = 100px */
}
.border-1px {
  border-bottom: 1px solid #000; /* 直接写 1px，实际渲染 1 物理像素 */
}
```

**（3）`box-shadow` 模拟边框**

**（4）`border-image` 方案**

### 6： **CSS如何优化性能？**

- 减少选择器复杂度（如避免嵌套过深）。

- 使用`transform`和`opacity`触发GPU加速（减少重绘）。

- 压缩CSS文件，删除未使用的代码。

- 避免频繁触发重排（如修改`width`、`margin`等属性）。

### **7：布局**

| 方案              | 维度  | 适用场景    | 兼容性   |
| --------------- | --- | ------- | ----- |
| **Float**       | 一维  | 旧版浏览器兼容 | IE8+  |
| **Flexbox**     | 一维  | 弹性排列、对齐 | IE10+ |
| **Grid**        | 二维  | 复杂网格布局  | IE11+ |
| **Position**    | 叠加  | 固定定位、层叠 | 全兼容   |
| **Media Query** | 响应式 | 多设备适配   | 全兼容   |

**Flexbox**

| **属性分类** | **关键属性**          | **作用**             |
| -------- | ----------------- | ------------------ |
| **容器属性** | `flex-direction`  | 主轴方向（行/列）          |
|          | `justify-content` | 主轴对齐（水平方向）         |
|          | `align-items`     | 交叉轴对齐（垂直方向）        |
| **子项属性** | `flex: 1`         | 自动填充剩余空间           |
|          | `align-self`      | 单独控制子项对齐           |
| **常用简写** | `flex: 1`         | `flex-grow: 1` 的缩写 |

```css
一、Flex 容器属性（Parent）
1:display: flex | inline-flex 
定义容器为 Flex 布局。
flex：块级 Flex 容器。
inline-flex：行内 Flex 容器。

2:flex-direction（主轴方向）
控制子元素的排列方向：
row（默认）：水平排列（从左到右）。
row-reverse：水平反向（从右到左）。
column：垂直排列（从上到下）。
column-reverse：垂直反向（从下到上）。

3. flex-wrap（换行方式）
控制子元素是否换行：
nowrap（默认）：不换行（可能溢出）。
wrap：自动换行（从上到下）。
wrap-reverse：反向换行（从下到上）。

4. justify-content（主轴对齐）
控制子元素在 主轴 上的对齐方式：
flex-start（默认）：左对齐。
flex-end：右对齐。
center：居中。
space-between：两端对齐，间距均分。
space-around：每个元素两侧间距相等。
space-evenly：所有间距完全均分。

5. align-items（交叉轴对齐）
控制子元素在 交叉轴 上的对齐方式：
stretch（默认）：拉伸填满容器高度。
flex-start：顶部对齐。
flex-end：底部对齐。
center：垂直居中。
baseline：按基线对齐（文本对齐）。


6. align-content（多行对齐）
控制 多行 子元素在交叉轴上的对齐方式（需 flex-wrap: wrap）：
stretch（默认）：拉伸填满剩余空间。
flex-start：多行紧贴顶部。
flex-end：多行紧贴底部。
center：多行垂直居中。
space-between / space-around：类似 justify-content。


二、Flex 子项属性（Children）
1. order（排序）
控制子元素的显示顺序（数值越小越靠前，默认 0）。 

2. flex-grow（扩展比例）
定义子元素的 扩展能力（分配剩余空间的比例，默认 0 不扩展）。 

3. flex-shrink（收缩比例）
定义子元素的 收缩能力（空间不足时收缩的比例，默认 1 可收缩）。 

4. flex-basis（初始尺寸）
定义子元素在分配空间前的 初始大小（类似 width，默认 auto）。 

5. flex（简写属性）
合并 flex-grow、flex-shrink、flex-basis：
flex: 1 → flex: 1 1 0%（等分剩余空间）。
flex: none → flex: 0 0 auto（固定大小，不伸缩）。 

6. align-self（单独对齐）
覆盖容器的 align-items，单独控制某个子项的对齐方式：
auto（默认）：继承父容器的 align-items。
flex-start / flex-end / center / stretch / baseline。
```

**Grid**

| **属性类型** | **关键属性**                   | **作用**   |
| -------- | -------------------------- | -------- |
| **容器属性** | `grid-template-columns`    | 定义列宽和数量  |
|          | `grid-template-areas`      | 命名布局区域   |
|          | `gap`                      | 控制行列间距   |
| **子项属性** | `grid-column` / `grid-row` | 基于网格线定位  |
|          | `grid-area`                | 直接引用命名区域 |
| **对齐属性** | `justify-items`            | 所有子项水平对齐 |
|          | `align-self`               | 单个子项垂直对齐 |

```css
1. display: grid | inline-grid
定义容器为 Grid 布局。
grid：块级网格容器。
inline-grid：行内网格容器。


2. 显式网格定义
（1）grid-template-columns / grid-template-rows
定义网格的 列宽 和 行高（支持多种单位）： 
单位：px、%、fr（剩余空间比例）、auto、minmax(min, max)（范围限制）。
函数：repeat(3, 1fr) → 重复 3 列，每列等分。
（2）grid-template-areas
通过命名区域定义布局（直观可视化）


3. 隐式网格定义
（1）grid-auto-columns / grid-auto-rows 
定义超出显式网格的 隐式轨道 大小
（2）grid-auto-flow
控制自动放置策略：
row（默认）：按行填充。
column：按列填充。
dense：尝试填充空白（紧凑布局）。 

4. 间距控制
（1）gap（row-gap / column-gap）
定义网格线之间的间距（替代老版 grid-gap）


5. 对齐方式
（1）justify-items / align-items
控制 所有子项 在网格单元格内的对齐：
start / end / center / stretch（默认拉伸填满）。
（2）justify-content / align-content
当网格总尺寸小于容器时，控制 整个网格 的对齐方式：
start / end / center / stretch / space-around / space-between。


二、Grid 子项属性（Children） 
1. 网格线定位
（1）grid-column / grid-row
通过 网格线编号 或 span 关键字定义子项的位置： 
简写：grid-area: row-start / column-start / row-end / column-end。
（2）grid-area
直接引用 grid-template-areas 定义的名称。
或作为 grid-row + grid-column 的简写。

2. 单个子项对齐
（1）justify-self / align-self
覆盖容器的对齐设置，单独控制子项：
```
