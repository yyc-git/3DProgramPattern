1.story_improve

preprocess:

- prepare glsl
- glsl converter->ShaderChunks

runtime:
<!-- - get shaderChunks to state -->
- load json
<!-- use most -->
use webpack->json loader

配置数据
    shaders.json
    shader_libs.json

- parse json
<!-- - handle shader libs with shader config -->
- handle shader libs with shader config
static branch
    fixed branch name
dynamic branch
    fixed

<!-- define:
handle define const -->

- handle sender
sender: add to specific sender array
attribute
uniform


add pos, type, send func, ...


<!-- 
handle result:
shader libs
sender array -->

- get shaderChunks to state
- Builder: shader libs + ShaderChunks to vs glsl, fs glsl
support all parts




result:
glsl
sender







2.story_before

one big vs glsl + one big fs glsl

#define

#if

3.abstract

give glsl compile abstract code

abstract: not only for glsl, but for else!



4.UML

domain model

flow


shader组合图


abstract UML:
not only for glsl, but for else!



# 引入故事，提出问题

- 引入故事
    - 描述故事
TODO why need glsl?
for material->shader



    - 给出代码

    - 给出UML

- 提出问题



# 主问题：给出直接的解决方案

- 请给出直接的解决方案?
    - 概述解决方案？
    TODO explain:
    glsl compiler support ts, res
    - 给出UML？
    - 给出代码？
    TODO explain:
    |>
    - 结合UML图，描述如何具体地解决问题？


# 主问题：分析存在的问题

- 请分析存在的问题?
- 提出改进方向？


# 主问题：给出可能的改进方案

- 请给出可能的改进方案?
    - 概述解决方案？
    - 给出UML ？
    - 给出代码？
    - 结合UML图，描述如何具体地解决问题？


# 主问题：分析存在的问题

- 请分析存在的问题?
- 提出改进方向？



# 主问题：给出使用模式的改进方案

- 请给出使用模式的改进方案?
    - 概述解决方案
    - 遵循哪些设计原则
    - 给出UML？
    - 给出代码？
    - 结合UML图，描述如何具体地解决问题？

# 主问题：提出模式


- 设计意图？
- 定义
    - 一句话定义？
    - 描述定义？
    - 通用UML？
    - 分析角色？
    - 角色之间的关系？
    - 角色的抽象代码？
    - 遵循的设计原则在UML中的体现？


- 应用
    - 优点？
    - 缺点？
无法正确使用.glsl的编译检查
    - 使用场景
    - 描述场景？
    - 实现该场景需要修改模式的哪些角色？
    - 使用模式有什么好处？
    - 注意事项？

- 扩展
    - 如何扩展、推广、发散？

反射？


更多的配置：
e.g. define: handle define const


- 结合其它模式
    - 结合哪些模式？
    - 使用场景是什么？
    - UML如何变化？
    - 代码如何变化？


# 主问题：最佳实践

- 结合具体项目实践经验，如何应用模式来改进项目？
    - 哪些场景不需要使用模式？
    - 哪些场景需要使用模式？
    - 给出具体的实践案例？


# 主问题：推荐更多资料

- 推荐更多资料？
