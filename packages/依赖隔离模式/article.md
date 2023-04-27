<!-- # [引入故事，提出问题] -->
# 编辑器如何替换引擎？

## 需求

编辑器使用Three.js引擎作为渲染引擎，来创建一个场景


## 实现思路

编辑器引入Three.js库，调用它的API来创建场景


## 给出UML

<!-- ![image](https://img2023.cnblogs.com/blog/419321/202303/419321-20230306212625502-380438801.png) -->
TODO tu


Client是用户

Editor是编辑器

Three.js是Three.js库


## 给出代码
Client：
```ts
createScene()
```

这里调用Editor来创建场景


我们看下Editor相关代码：
```ts
import {
	Scene,
	...
} from "three";

export let createScene = function () {
	let scene = new Scene();

	...
}
```

createScene函数调用Three.js库创建场景


## 提出问题


如何将Three.js引擎替换为Babylon.js引擎？




# [解决问题的方案，分析存在的问题]?


## 概述解决方案？

编辑器改为引入Babylon.js库，并修改编辑器中与引擎相关的代码

## 给出UML？


TODO tu

Babylon.js是Babylon.js库



## 结合UML图，描述如何具体地解决问题？

- 将Three.js换成Babylon.js
- 修改Editor的相关代码


## 给出代码？

Client代码不变

Editor
```ts
import {
	Scene,
	Engine,
	...
} from "babylonjs";

export let createScene = function () {
	let scene = new Scene(new Engine())

	...
}
```

Editor改为引入Babylon.js库，并修改createScene函数中与引擎相关的代码

## 提出问题

现在需要修改编辑器中所有与引擎相关代码，这样的成本太高了

有没有办法能在不修改编辑器代码的情况下实现替换引擎呢？


# [给出使用模式的改进方案]

## 概述解决方案

只要解除编辑器和具体的引擎的依赖，把替换引擎的逻辑隔离出去就可以



## 给出UML？

TODO tu


RenderEngine接口是对渲染引擎的抽象

BabylonImplement是使用Babylon.js引擎对RenderEngine接口的实现

ThreeImplement是使用Three.js引擎对RenderEngine接口的实现

Babylon.js是Babylon.js库

Three.js是Three.js库

Client通过依赖注入的方式注入RenderEngine实现，使Editor能够调用它来创建场景

DependencyContainer是注入的RenderEngine实现的容器，提供它的get/set函数


## 结合UML图，描述如何具体地解决问题？

- 替换Three.js为Babylon.js引擎现在不再影响Editor了，只需要增加BabylonImplement，并让Client改为注入BabylonImplement即可


## 给出代码？

RenderEngine
```ts
//scene为抽象类型
//这里用any类型表示抽象类型
type scene = any

export interface RenderEngine {
    createScene(): scene
    ...
}
```

RenderEngine抽象了createScene函数


ThreeImplement
```ts
import {
	Scene,
...
} from "three";

export let implement = (): RenderEngine => {
	return {
		createScene: () => {
			return new Scene();
		},
		...
  }
}
```

ThreeImplement使用Three.js引擎，实现了RenderEngine接口



BabylonImplement
```ts
import {
	Scene,
	Engine,
	...
} from "babylonjs";

export let implement = (): RenderEngine => {
	return {
		createScene: () => {
			return new Scene(new Engine())
		},
		...
  }
}
```

BabylonImplement使用Babylon.js引擎，实现了RenderEngine接口



DependencyContainer
```ts
let _renderEngine: RenderEngine = null

export let getRenderEngine = (): RenderEngine => {
  return _renderEngine;
}

export let setRenderEngine = (renderEngine: RenderEngine) {
  _renderEngine = renderEngine;
}
```


DependencyContainer提供了get/set函数来获得和设置注入的RenderEngine实现


Editor
```ts
export let injectDependencies = function (implement: RenderEngine) {
	setRenderEngine(implement);
};

export let createScene = function () {
	let { createScene, ...} = getRenderEngine()

	let scene = createScene()

	...
}
```

Editor增加了injectDependencies函数，实现了注入由Client传过来的RenderEngine实现

createScene函数通过DependencyContainer获得注入的RenderEngine实现，调用它来创建场景
它只知道RenderEngine接口，没有依赖具体的RenderEngine实现


Client
```ts
import { implement } from "./BabylonImplement";

injectDependencies(implement())

createScene()
```


Client注入了BabylonImplement



<!-- # 设计意图

阐明模式的设计目标 -->

# 定义

## 一句话定义？

隔离系统的外部依赖，使得外部依赖的变化不会影响系统

<!-- ## 概述抽象的解决方案 -->
## 补充说明

将外部依赖隔离后，系统变得更“纯”了，类似于函数式编程中的[“纯函数”](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch3.html#%E8%BF%BD%E6%B1%82%E2%80%9C%E7%BA%AF%E2%80%9D%E7%9A%84%E7%90%86%E7%94%B1)的概念，消除了外部依赖带来了副作用

哪些依赖属于外部依赖呢？对于编辑器而言，引擎、UI组件库（如Ant Design）、后端服务、文件操作、日志等都属于外部依赖；
对于引擎而言，各种子引擎（如物理引擎、动画引擎、例子引擎）、后端服务、文件操作等都属于外部依赖

可以将每个可能会变化的外部依赖都抽象为接口，从而都隔离出去。



## 通用UML？

TODO tu



## 分析角色？


我们来看看模式的相关角色：

- Dependency
该角色是依赖的接口
- DependencyImplement
该角色是对Dependency的实现
- DependencyLibrary
该角色是一个库
- Client
该角色是用户，通过依赖注入的方式注入DependencyImplement
- DependencyContainer
该角色是注入的DependencyImplement的容器，提供它的get/set函数
- System
该角色使用了一个或多个外部依赖，它只知道外部依赖的接口（Dependency）而不知道具体实现（DependencyImplement）


## 角色之间的关系？

- 可以有多个Dependency
如除了RenderEngine以外，还可以File、Server等
- 一个Dependency可以有多个DependencyImplement
如RenderEngine除了有ThreeImplement，还可以有BabylonImplement等
- 一个DependencyImplement一般只使用一个DependencyLibrary，但也可以使用多个DependencyLibrary
如对于RenderEngine，可以增加ThreeAndBabylonImplement，它同时使用Three.js和Babylon.js这两个DependencyLibrary。这样就使得编辑器可以同时使用两个引擎来渲染


## 角色的抽象代码？

下面我们来看看各个角色的抽象代码：

- Dependency的抽象代码
```ts
type abstractType1 = any;
...

export interface Dependency1 {
    abstractAPI1(): abstractType1,
    ...
}
```
- DependencyImplement的抽象代码
```ts
import {
	api1,
...
} from "dependencylibrary1";

export let implement = (): Dependency1 => {
	return {
		abstractAPI1: () => {
			...
			return api1()
	},
		...
  }
}
```
- DependencyLibrary的抽象代码
```ts
export let api1 = function () {
	...
}

...
```
- DependencyContainer的抽象代码
```ts
let _dependency1: Dependency1 = null

export let getDependency1 = (): Dependency1 => {
  return _dependency1;
}

export let setDependency1 = (dependency1: Dependency1) {
  _dependency1 = dependency1;
}

更多的get/set函数（如getDependency2、setDependency2）...
```
- System的抽象代码
```ts
export let injectDependencies = function (dependency1Implement1: Dependency1, ...) {
	setDependency1(dependency1Implement1)
	注入其它DependencyImplement...
};

export let doSomethingUseDependency1 = function () {
	let { abstractAPI1, ...} = getDependency1()

	let abstractType1 = abstractAPI1()

	...
}

更多doSomethingUseDependencyX函数...
```
- Client的抽象代码
```ts
injectDependencies(implement(), 其它DependencyImplement...)

doSomethingUseDependency1()
```



## 遵循的设计原则在UML中的体现？


依赖隔离模式主要遵循下面的设计原则：
- 依赖倒置原则
系统依赖于外部依赖的抽象（Dependency）而不是外部依赖的细节（DependencyImplement和DependencyLibrary），从而外部依赖的细节的变化不会影响系统
- 开闭原则
可以增加更多的Dependency，从而隔离更多的外部依赖；或者对一个Dependency增加更多的DependencyImplement，从而能够替换外部依赖的实现。这些都不会影响System，从而实现了对扩展开放
如果需要修改已有的外部依赖（如升级版本），这也只会影响DependencyImplement和DependencyLibrary，不会影响System，从而实现了对修改关闭

依赖隔离模式也应用了“依赖注入”、“控制反转”的思想



# 应用

## 优点

- 提高系统的稳定性
外部依赖的变化不会影响系统
- 提高系统的扩展性
可以任意替换外部依赖而不影响系统
- 提高系统的可维护性
系统与外部依赖解耦，便于维护


## 缺点

无

## 使用场景

### 场景描述

使用了频繁变化的外部依赖的系统

### 具体案例

<!-- ## 实现该场景需要修改模式的哪些角色？ -->
<!-- ## 使用模式有什么好处？ -->

- 替换编辑器使用的引擎、UI库等第三方库

- 升级编辑器使用的引擎、UI库等第三方库的版本

如需要升级编辑器使用的Three.js的版本，则只需要修改ThreeImplement，使其使用新版本的Three.js库即可

- 增加编辑器使用的引擎、UI库等第三方库

如需要让编辑器在已使用Three.js引擎的基础上增加使用Babylon.js引擎，则只需要加入BabylonImplement和Babylon.js库即可


## 注意事项

- Dependency要足够抽象，才不至于在修改或增加DependencyImplement时需要修改Dependency，从而影响System
当然，在开发阶段难免考虑不足，如当一开始只有一个DependencyImplement时，Dependency往往只会考虑这个DependencyImplement，导致在增加其它DependencyImplement时就需要修改Dependency，使其更加抽象，这样才能容纳更多的DependencyImplement带来的变化
因此，我们可以允许在开发阶段修改Dependency，但是在发布前则确保Dependency已经足够抽象和稳定

- 有多少个Dependency接口，DependencyContainer就有多少个get/set函数

- 最好一开始就使用依赖隔离模式将所有的可能会变化的外部依赖都隔离，这样可以避免到后期修改外部依赖时需要修改系统所有相关代码的情况


# 扩展

<!-- TODO 编辑器ui -->


如果基于依赖隔离模式这样设计一个架构：

- 定义4个层：外部依赖层、应用服务层、领域服务层、领域模型层，其中前者是后者的上层，上层依赖下层
- 外部依赖层则属于独立的层，该层中的外部依赖是按照依赖隔离模式设计的，在运行时由用户注入
- 将系统的所有外部依赖都隔离出去，也就是为每个外部依赖创建一个Dependency，其中DependencyImplement位于外部依赖层，Dependency位于领域模型层中的Application Core
<!-- 其它三层不依赖外部依赖层，而是依赖领域模型层中的Application Core（具体就是依赖Dependency） -->
- 运用[领域驱动设计DDD](https://www.cnblogs.com/chaogex/p/12408802.html)设计系统,将系统的核心逻辑建模为领域模型，放到领域模型层

那么这样的架构就是洋葱架构
洋葱架构如下图所示：
![image](https://img2022.cnblogs.com/blog/419321/202206/419321-20220609041114118-2037325753.webp)

洋葱架构与传统的三层架构的区别是颠倒了层之间的依赖关系：洋葱架构将三层架构中的最下层（外部依赖层）改为最上层；将三层架构中的倒数第二层（领域模型层）下降为最下层
洋葱架构的核心思想就是将变化最频繁的外部依赖隔离出去，并使变化最少的领域模型层独立而不依赖其它层。
<!-- 在传统的架构中，领域模型层会依赖外部依赖层（如在领域模型中调用后端服务等），但是现在却解耦了 -->
这样的好处是外部依赖层容易变化，但它的变化现在不会影响其他层


<!-- # 结合其它模式

## 结合哪些模式？
## 使用场景是什么？
## UML如何变化？
## 代码如何变化？ -->




# 最佳实践

<!-- ## 结合具体项目实践经验，如何应用模式来改进项目？ -->
## 哪些场景不需要使用模式？


- 系统的外部依赖比较稳定，不易变化


- 开发Demo或者短期使用的系统



对于上面的场景，可以在系统中直接调用外部依赖库，这样开发得最快


<!-- ## 哪些场景需要使用模式？ -->
## 给出具体的实践案例？

<!-- - 使用了频繁变化的外部依赖的系统 -->
- 扩大使用场景

编辑器的外部依赖不只是引擎，也包括UI组件库等
如需要将旧的UI组件库（如React UI 组件库-Antd）替换为新的组件库，则可按照依赖隔离模式，提出UI这个Dependency接口，并加入作为接口实现的OldUIImplement、NewUIImplement，在这两个接口的实现中调用对应的UI组件库


除了编辑器外，引擎、网站等系统也可以使用依赖隔离模式
如需要替换引擎的物理引擎、将网站的后端服务从阿里云换成腾讯云等场景，都可以使用依赖隔离模式




有些外部依赖在运行时会变化，对于这种情况，使用依赖隔离模式后可以在运行时注入变化后的DependencyImplement
如编辑器向用户提供了“切换渲染效果”的功能：用户点击一个按钮后，就可以切换渲染引擎来渲染场景
为了实现该功能，只需在按钮的点击事件中注入对应的DependencyImplement到DependencyContainer中即可



- 满足各种修改外部依赖的用户需求

我遇到过这种问题：3D应用开发完成后，交给3个外部用户使用。用了一段时间后，这3个用户提出了不同的修改外部依赖的要求：第一个用户想要升级3D应用依赖的渲染引擎A，第二个用户想要替换A为B，第三个用户想要同时使用B和升级后的A来渲染。
如果3D应用是直接调用外部依赖库的话，我们就需要将交付的代码修改为3个版本，分别满足3个用户的需求
每个版本都需要修改系统中与外部依赖相关的所有代码，这样导致工作量很大

如果使用了依赖隔离模式进行了解耦，那么就只需要对3D应用做下面的修改：
1.修改AImplement和ALibrary（升级）
2.增加BImplement
3.增加BLibrary

交付的代码只有1个版本，只是在Client中分别对这3个用户注入不同的DependencyImplement：
1.Client为第一个用户注入AImplement
2.Client为第二个用户注入BImplement
2.Client为第三个用户注入ABImplement

这样就能减少很多工作量



# 更多资料推荐

可以了解下[依赖注入 控制反转 依赖倒置](https://www.google.com/search?q=%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5+%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC+%E4%BE%9D%E8%B5%96%E5%80%92%E7%BD%AE&oq=%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5+%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC+%E4%BE%9D%E8%B5%96%E5%80%92%E7%BD%AE&aqs=chrome..69i57j0i8i13i30.5068j0j7&sourceid=chrome&ie=UTF-8)

关于洋葱架构，可以在网上搜索“洋葱架构”、“the-onion-architecture-part”

六边形架构类似于洋葱架构，可以在网上搜索“六边形架构”

