story:
engine 
    state
editor
    logic state
    ui state



before:
oop
	command pattern?
    how to?




role abstract:
queue
state
copy mutable fields



1. story_before
use oo to implement


Comand Array



TODO explain:
Editor, EditorLogic, EditorUI, Engine



2. story_improve

engine 
    state
editor
    logic state
    ui
        state: reducer store


three * 2 arrays



TODO explain:
use reducer, so not operate dom



TODO explain:
mutable fields in engine state:
some fields are considered by performance, shouldn't copy but mutable operate instead;
some fields are 图形API的对象（e.g. WebGL的WebGLBuffer）。因为图形API是面向对象的，所以它的对象是类的实例，本身就是mutable的



3. abstract code




4. draw UML



<!-- TODO explain:
mutable fields in engine state:
data oriented component buffer
(should ???)

WebGL Objects:e.g. WebGLProgram, WebGLBuffer,...
(should re-init) -->


# 引入故事，提出问题

- 引入故事
    - 描述故事
    - 给出代码

    - 给出UML

- 提出问题



# 主问题：给出直接的解决方案

- 请给出直接的解决方案?
    - 概述解决方案？
    - 给出UML？
    - 给出代码？
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
    - 使用场景
    - 描述场景？
    - 实现该场景需要修改模式的哪些角色？
    - 使用模式有什么好处？
    - 注意事项？

- 扩展
    - 如何扩展、推广、发散？



- 结合其它模式
    - 结合哪些模式？

结合ECS模式

TODO explain:
mutable fields in engine state:
data oriented component buffer
(should ???)



<!-- TODO
reallocate geometry gameobject map -->


    - 使用场景是什么？
    - UML如何变化？
    - 代码如何变化？


# 主问题：最佳实践

- 结合具体项目实践经验，如何应用模式来改进项目？
    - 哪些场景不需要使用模式？
    - 哪些场景需要使用模式？
    - 给出具体的实践案例？



TODO explain:
mutable fields in engine state:

WebGL Objects:e.g. WebGLProgram, WebGLBuffer,...
(should re-init)

restore from currentState


# 主问题：推荐更多资料

- 推荐更多资料？


<!-- [命令模式->撤销和重做](https://gpp.tkchu.me/command.html#%E6%92%A4%E9%94%80%E5%92%8C%E9%87%8D%E5%81%9A) -->