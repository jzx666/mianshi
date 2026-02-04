# 1：基本类型，扩展类型

## 基本类型

number，string，boolean，数组，object，null，undefined

viod：表示函数没有返回值；申明为 `void` 类型的变量，只能赋予 `undefined` 和 `null`。

never 表示函数不会结束；空类型，表示永远不会有值的一种类型。

any

函数重载：约束函数的，在函数调用前，对函数调用的多种情况进行声名。

## 扩展类型

**类型别名，枚举，接口，类**

```ts
//位运算
enum Permission {
    Read = 1,      //0001
    Write = 2,  //0010
    Create = 4, //0100
    Delete = 8  //1000
}
//或运算
let p = Permission.Read | Permission.Write;//0011
//且运算
let w = p & Permission.Write;//0010
//异或运算(删除)
p = p ^ Permission.Write;//0011 异或 0010 = 0001（相同取0，不同取1）
```

```ts
//接口和类型别名
//1：接口可以通过extends实现继承，类型别名可以通过&实现拓展，
//区别是子接口不能覆盖父接口的值，类型别名可以覆盖;
//接口可以被类实现，类型别名不可以
class A {
    a1: string
    a2: string
    a3: string
}
class B {
    b1: string
    b2: string
    b3: string
}
inerface C extands A,B {}
const c:C = {
    //a1,a2,a3,b1,b2,b3
}

//2：type可以使用in 关键字生成映射类型 interface不行
type Keys = "firstname" | "surname"
type DudeType = {
  [key in Keys]: string
}
```

```ts
//ts中的修饰符
访问修饰符：public、private、protected
只读修饰符：readonly
静态修饰符：static
抽象修饰符：abstract
可选修饰符：?
方法修饰符：async、override
参数属性修饰符：public、private、protected、readonly
```

# 2：泛型

`泛型是值附属于函数，类，接口，类型别名之上的类型`

`泛型相当于是一个类型变量，在定义时，无法预先指定具体的类型`

# 3：TS的高级类型工具

- **`Partial`、`Required`、`Readonly`**：修改属性特性。

- **`Pick`、`Omit`**：选择或排除属性。

- **`Record`**：创建键值对类型。

- **`Exclude`、`Extract`**：操作联合类型。

- **`ReturnType`、`Parameters`**：操作函数类型。

- **`Awaited`**：操作 `Promise` 类型。
