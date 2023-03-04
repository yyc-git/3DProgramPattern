大家好~本文提出了“依赖隔离”模式

系列文章详见：
[3D编程模式：开篇](https://www.cnblogs.com/chaogex/p/16354132.html)

本文相关代码在这里：
[相关代码](https://github.com/yyc-git/3DProgramPattern/tree/master/packages/%E4%BE%9D%E8%B5%96%E9%9A%94%E7%A6%BB%E6%A8%A1%E5%BC%8F)

[TOC]

# 编辑器需要替换引擎

编辑器使用了Three.js引擎作为渲染引擎，来创建一个默认的3D场景
编辑器相关代码Editor：
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
客户相关代码Client：
```ts
import { createScene } from "./Editor";

createScene()
```

![image](https://img2022.cnblogs.com/blog/419321/202206/419321-20220609061119456-1628028294.png)



现在需要升级Three.js引擎的版本，或者替换为其它的渲染引擎，我们会发现非常困难，因为需要修改编辑器中所有调用了该引擎的代码（如需要修改createScene函数），代码一多就不好修改了

有没有办法能在不需要修改编辑器相关代码的情况下，就升级引擎版本或者替换引擎呢？

只要解除编辑器和具体的引擎的依赖，并把引擎升级或替换的逻辑隔离出去就可以！新设计的类图如下所示：
![image](https://img2022.cnblogs.com/blog/419321/202206/419321-20220609064842335-487734073.png)



IRenderEngine接口对渲染引擎的API进行抽象
IRenderEngine
```ts
//scene为抽象类型，这里用any类型表示
type scene = any;

export interface IRenderEngine {
    createScene(): scene
    ...
}
```
ThreeImplement用Three.js引擎实现IRenderEngine接口
ThreeImplement
```ts
import { IRenderEngine } from "./IRenderEngine";
import {
	Scene,
...
} from "three";

export let implement = (): IRenderEngine => {
	return {
		createScene: () => {
			return new Scene();
		},
		...
  }
}
```
DependencyContainer负责维护由Client注入的IRenderEngine的实现
DependencyContainer:
```ts
import {IRenderEngine} from "./IRenderEngine"

let _renderEngine: IRenderEngine = null

export let getRenderEngine = (): IRenderEngine => {
  return _renderEngine;
}

export let setRenderEngine = (renderEngine: IRenderEngine) {
  _renderEngine = renderEngine;
}
```
Editor增加injectDependencies函数，用于通过DependencyContainer注入由Client传过来的IRenderEngine的实现；另外还通过DependencyContainer获得注入的IRenderEngine的实现，调用它来创建场景
Editor：
```ts
import { getRenderEngine, setRenderEngine } from "./DependencyContainer";
import { IRenderEngine } from "./IRenderEngine";

export let injectDependencies = function (threeImplement: IRenderEngine) {
	setRenderEngine(threeImplement);
};

export let createScene = function () {
	let { createScene, ...} = getRenderEngine()

	let scene = createScene()

	...
}
```
Client选择要注入的IRenderEngine的实现
Client：
```ts
import { createScene, injectDependencies } from "./Editor";
import { implement } from "./ThreeImplement";

injectDependencies(implement())

createScene()
```



经过这样的设计后，就把编辑器和渲染引擎隔离开了
现在如果要升级Three.js引擎版本，只需要修改ThreeImplement；如果要替换为Babylon引擎，只需要增加BabylonImplement，修改Client为注入BabylonImplement。它们都不再影响Editor的代码了


# 设计意图

隔离系统的外部依赖

# 定义

我们定义依赖隔离模式为：
**隔离系统的外部依赖，使得外部依赖的变化不会影响系统**

将外部依赖隔离后，系统变得更“纯”了，类似于函数式编程中的[“纯函数”](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch3.html#%E8%BF%BD%E6%B1%82%E2%80%9C%E7%BA%AF%E2%80%9D%E7%9A%84%E7%90%86%E7%94%B1)的概念，消除了外部依赖带来了副作用



那么哪些依赖属于外部依赖呢？对于编辑器而言，渲染引擎、后端服务、文件操作、日志等都属于外部依赖；对于网站而言，UI组件库（如Ant Design）、后端服务、数据库操作等都属于外部依赖。可以将每个外部依赖都抽象为对应的IDendency接口，从而都隔离出去。



![image](https://img2022.cnblogs.com/blog/419321/202206/419321-20220609064857237-1496656861.png)

<center style="font-size:14px;color:#C0C0C0;text-decoration:underline">依赖隔离模式的通用类图</center> 








我们来看看依赖隔离模式的相关角色：

- IDendepency（依赖接口）
该角色对依赖的具体库的API进行了抽象
- DependencyImplement（依赖实现）
该角色是对IDendepency的实现
- DependencyLibrary（依赖的具体库）
该角色通常为第三方库，如Three.js引擎等
- DependencyContainer（依赖容器）
该角色封装了注入的依赖实现，为每个注入的依赖实现提供get/set函数
- System（系统）
该角色使用了一个或多个外部依赖，它只知道外部依赖的接口而不知道外部依赖的具体实现

各个角色之间的关系为：
- 可以有多个依赖接口，如除了IRenderEngine以外，还可以IFile、IServer等依赖接口
- 一个IDendepency可以有多个DependencyImplement，如对于IRenderEngine，除了有ThreeImplement，还可以有Babylon引擎的依赖实现BabylonImplement
- 一个DependencyImplement一般只组合一个DependencyLibrary，但也可以组合多个DependencyLibrary，比如对于IRenderEngine，可以增加ThreeAndBabylonImplement，它同时组合Three.js和Babylon.js这两个DependencyLibrary，这样就使得编辑器可以同时使用两个引擎来渲染，达到最大化的渲染能力

下面我们来看看各个角色的抽象代码：

- IDendepency抽象代码
```ts
type abstractType1 = any;
...

export interface IDependency1 {
    abstractAPI1(): abstractType1,
    ...
}
```
- DependencyImplement抽象代码
```ts
import { IDependency1 } from "./IDependency1";
import {
	api1,
...
} from "dependencylibrary1";

export let implement = (): IDependency1 => {
	return {
		abstractAPI1: () => {
			...
			return api1()
	},
		...
  }
}
```
- DependencyLibrary抽象代码
```ts
export let api1 = function () {
	...
}

...
```
- DependencyContainer抽象代码
```ts
import { IDependency1 } from "./IDependency1"

let _dependency1: IDependency1 = null
...

export let getDependency1 = (): IDependency1 => {
  return _dependency1;
}

export let setDependency1 = (dependency1: IDependency1) {
  _dependency1 = dependency1;
}

...
```
- System抽象代码
```ts
import { getDependency1, setDependency1 } from "./DependencyContainer";
import { IDependency1 } from "./IDependency1";

export let injectDependencies = function (dependency1Implement1: IDependency1, ...) {
	setDependency1(dependency1Implement1)
	注入其它依赖实现...
};

export let doSomethingNeedDependency1 = function () {
	let { abstractAPI1, ...} = getDependency1()

	let abstractType1 = abstractAPI1()

	...
}
```
- Client抽象代码
```ts
import { doSomethingNeedDependency1, injectDependencies } from "./System";
import { implement } from "./Dependency1Implement1";

injectDependencies(implement(), 其它依赖实现...)

doSomethingNeedDependency1()
```


依赖隔离模式主要遵循下面的设计原则：
- 依赖倒置原则
系统依赖于外部依赖的抽象（IDendepency）而不是外部依赖的细节（DependencyImplement和DependencyLibrary），从而外部依赖的细节的变化不会影响系统
- 开闭原则
可以增加更多的IDendepency，从而隔离更多的外部依赖；或者对一个IDendepency增加更多的DependencyImplement，从而能够替换外部依赖的实现。这些都不会影响System，从而实现了对扩展开放
可以升级外部依赖，这也只会影响DependencyImplement和DependencyLibrary，不会影响System，从而实现了对修改关闭

依赖隔离模式也应用了“依赖注入”、“控制反转”的思想



# 应用

**优点**
- 提高系统的稳定性
外部依赖的变化不会影响系统
- 提高系统的扩展性
可以任意修改外部依赖的实现而不影响系统
- 提高系统的可维护性
系统与外部依赖解耦，便于维护

**缺点**
无

**使用场景**
- 需要替换外部依赖的实现，如替换编辑器使用的渲染引擎
- 外部依赖经常变化，如编辑器使用的渲染引擎的版本频繁升级
- 运行时外部依赖会变化
对于这种情况，在运行时注入对应的DependencyImplement即可。如编辑器向用户提供了“切换渲染效果”的功能，使用户点击一个按钮后，就可以切换渲染引擎。为了实现该功能，只需在按钮的点击事件中注入对应的DependencyImplement到DependencyContainer中即可

**注意事项**
- IDendepency要足够抽象，这样才能不至于在修改或增加DependencyImplement时修改IDendepency，导致影响System
当然，在开发阶段难免考虑不足，如当一开始只有一个DependencyImplement时，IDendepency往往只会考虑这个DependencyImplement，导致在增加其它DependencyImplement时就需要修改IDendepency，使其变得更加抽象。
我们可以在开发阶段修改IDendepency，而在上线后则确保IDendepency已经足够抽象和稳定，不需要再改动

# 扩展

如果基于依赖隔离模式这样设计一个架构：

- 定义4个层，其中的应用服务层、领域服务层、领域模型层为上下层的关系，上层依赖下层；外部依赖层则属于独立的层，层中的外部依赖是按照依赖隔离模式设计，在运行时注入
- 将系统的所有外部依赖都隔离出去，也就是为每个外部依赖创建一个IDendepency，其中DependencyImplement位于外部依赖层，IDendepency位于领域模型层中的Application Core
其它三层不依赖外部依赖层，而是依赖领域模型层中的Application Core（具体就是依赖IDendepency）
- 运用[领域驱动设计DDD](https://www.cnblogs.com/chaogex/p/12408802.html)设计系统,将系统的核心逻辑建模为领域模型，放到领域模型层

那么这样的架构就是洋葱架构
洋葱架构如下图所示：
![image](https://img2022.cnblogs.com/blog/419321/202206/419321-20220609041114118-2037325753.webp)

它的核心思想就是将变化最频繁的外部依赖层隔离出去，并使变化最少的领域模型层独立而不依赖其它层。
在传统的架构中，领域模型层会依赖外部依赖层（如在领域模型中调用后端服务等），但是现在却解耦了。这样的好处就是如果外部依赖层变化，不会影响其他层


# 最佳实践

如果只是开发Demo或者短期使用的系统，可以在系统中直接调用外部依赖库，这样开发得最快；
如果要开发长期维护的系统（如编辑器），则最好一开始就使用依赖隔离模式将所有的外部依赖都隔离，或者升级为洋葱架构。这样可以避免到后期如果要修改外部依赖时需要修改系统所有相关代码的情况。

我遇到过这种问题：3D应用开发完成后，交给3个外部用户使用。用了一段时间后，这3个用户提出了不同的修改外部依赖的要求：第一个用户想要升级3D应用依赖的渲染引擎A，第二个用户想要替换A为B，第三个用户想要同时使用B和升级后的A来渲染。
如果3D应用是直接调用外部依赖库的话，我们就需要去修改交付的3份代码中系统的相关代码，且每份代码都需要不同的修改（因为3个用户的需求不同），工作量很大；
如果使用了依赖隔离模式进行了解耦，那么就只需要对3D应用做下面的修改：
1.修改AImplement和ALibrary（升级）
2.增加BImplement
3.增加BLibrary
4.增加ABImplement
对交付给用户的代码做下面的修改：
1.更新第一个用户交付代码的AImplement和ALibrary
2.为第二个用户交付代码增加BImplement、BLibrary；修改Client代码，注入BImplement
3.为第三个用户交付代码增加ABImplement、BLibrary；修改Client代码，注入ABImplement
相比之下工作量减少了很多





# 更多资料推荐

可以了解下[依赖注入 控制反转 依赖倒置](https://www.google.com/search?q=%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5+%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC+%E4%BE%9D%E8%B5%96%E5%80%92%E7%BD%AE&oq=%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5+%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC+%E4%BE%9D%E8%B5%96%E5%80%92%E7%BD%AE&aqs=chrome..69i57j0i8i13i30.5068j0j7&sourceid=chrome&ie=UTF-8)

洋葱架构的资料在这里：[资料](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)

六边形架构类似于洋葱架构，相关资料在[这里](https://www.jianshu.com/p/c405aa19a049)



# 参考资料
[《设计模式之禅》](https://m.douban.com/book/subject/25843319/)