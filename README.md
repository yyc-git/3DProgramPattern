# 《3D编程模式》

本书是开源书，罗列了我从自己的实战项目中提炼出来的关于3D编程（主要包括“3D引擎/游戏引擎”、“编辑器”开发）的各种编程模式

本书作者：杨元超

**[在线阅读](https://yyc-git.github.io/3dProgramPattern/docs/%E5%89%8D%E8%A8%80)**


## 源码索引

要想运行源码，请在Clone本仓库后，先在仓库根目录执行下面的命令：
```js
npm install
npm run bootstrap
```
安装了yarn的同学可以执行下面的命令来替代上面的命令：
```js
yarn
yarn bootstrap
```


下面是各个模式的源码索引：

- ECS模式源码
    - [普通英雄和超级英雄](./ECS模式代码/story_before/)
    - [基于组件化的思想改进](./ECS模式代码/story_after/)
    - [使用ECS模式来改进](./ECS模式代码/story_improve/)
    - [抽象代码](./ECS模式代码/ecs_pattern_role_abstract/)
- 撤销重做模式源码
    - [使用命令模式实现撤销重做](./撤销重做模式代码/story_before/)
    - [使用撤销重做模式来改进](./撤销重做模式代码/story_improve/)
    - [抽象代码](./撤销重做模式代码/redoundo_pattern_role_abstract/)
- 多线程模式源码
    - [单线程](./多线程模式代码/story_before/)
    - [使用多线程模式来改进](./多线程模式代码/story_improve/)
    - [抽象代码](./多线程模式抽象代码/)
- 管道模式源码
    - [在一个模块中实现两个运行环境的逻辑](./管道模式代码/story_before/)
    - [拆分模块](./管道模式代码/story_after/)
    - [使用管道模式来改进](./管道模式代码/story_improve/)
    - [抽象代码](./管道模式抽象代码/)
- 积木模式源码
    - [一个开发者开发引擎](./积木模式代码_ts/story_before/)
    - [加入更多的开发者一起开发引擎](./积木模式代码_ts/story_after/)
    - [使用积木模式来改进](./积木模式代码_ts/story_improve/)
    - [抽象代码](./积木模式抽象代码/)
- 拼接模式源码
    - [使用预定义宏拼接GLSL](./拼接模式代码/story_before/)
    - [使用拼接模式来改进](./拼接模式代码/story_improve/)
    - [抽象代码](./拼接模式抽象代码/)
- 依赖隔离模式源码
    - [编辑器使用引擎创建场景](./依赖隔离模式代码/story_before/)
    - [编辑器替换引擎](./依赖隔离模式代码/story_after/)
    - [使用依赖隔离模式来改进](./依赖隔离模式代码/story_improve/)
    - [抽象代码](./依赖隔离模式代码/role_abstract/)



## 版权许可

本书采用“保持署名”创意共享 4.0 许可证。只要保持原作者署名，您可以自由地阅读、分享、修改本书。