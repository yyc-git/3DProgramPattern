# 引入故事，提出问题

- 引入故事
    - 描述故事

甲正在实现一个同时支持PC端、移动端的3D引擎中的渲染部分

<!-- 他实现了初始化WebGL1的逻辑

因为使用延迟渲染来支持多光源，所以分别实现了生成GBuffer、着色的逻辑

他还实现了Tonemap的后处理逻辑  -->


两个运行环境的差异如下所示：

- PC端支持WebGL2，移动端只支持WebGL1
- 因为移动端不支持multi render targets，所以不支持延迟渲染

甲实现了一个Render模块，该模块分别实现了初始化WebGL、渲染、Tonemap后处理的逻辑

为了处理运行环境的差异，他的思路如下；

- 在“初始化WebGL”中判断运行环境，PC端获得WebGL2的上下文，移动端则获得WebGL1的上下文
- 在“渲染”中判断运行环境，PC端使用延迟渲染，移动端使用前向渲染
- 在“Tonemap”中判断运行环境，PC端使用WebGL2的上下文，移动端则使用WebGL1的上下文


    - 给出代码

    - 给出UML

- 提出问题

能否将WebGL1、WebGL2的逻辑分开？

能否将PC端和移动端的渲染逻辑分开？




<!-- 
<!-- 因为移动端只支持WebGL1，所以需要重新实现初始化WebGL1的逻辑 -->

因为移动端不支持multi render targets，所以只能使用前向渲染替代延迟渲染

<!-- 原来的Tonemap使用了WebGL2的上下文，需要改为使用WebGL1的上下文 -->

初始化WebGL1和Tonemap的逻辑不变


另外，甲想要找再找个开发者乙来一起开发 -->


# 主问题：给出直接的解决方案

- 请给出直接的解决方案?
    - 概述解决方案？

可以从Render模块中提出两个模块：RenderInPC, RenderInMobile，分别对应PC端和移动端的渲染；

将Render模块中的逻辑提出来，拆分成一个个单独的模块；

分别针对WebGL1和WebGL2，拆分为单独的模块


    - 给出UML？
    - 给出代码？
    - 结合UML图，描述如何具体地解决问题？




# 主问题：分析存在的问题

- 请分析存在的问题?
- 提出改进方向？


<!-- 可配置 -->
<!-- 定制管线，适配各种运行环境 -->
<!-- 通过JSON定制管线，适配各种运行环境 -->
<!-- 如何通过可配置的JSON指定渲染管线中的Job的执行顺序？ -->
管道可配置
如何通过可配置的JSON指定渲染中各个逻辑的执行顺序？



多人开发，组合管线：
在多人开发中，如何让每个人只独立开发自己负责的逻辑，并且能方便地将每个人实现的逻辑集成到渲染中？



<!-- # 主问题：给出可能的改进方案

- 请给出可能的改进方案?
    - 概述解决方案？
    - 给出UML ？
    - 给出代码？
    - 结合UML图，描述如何具体地解决问题？




# 主问题：分析存在的问题

- 请分析存在的问题?
- 提出改进方向？ -->





# 主问题：给出使用模式的改进方案


- 请给出使用模式的改进方案?
    - 概述解决方案
    <!-- Tree

    传递state -->


解决第一个问题： 如何通过可配置的JSON指定渲染中各个逻辑的执行顺序？

<!-- 如何通过可配置的JSON指定渲染中各个逻辑的执行顺序？ -->
将RenderInPC和RenderInMobile升级成两个渲染管道

将其中的逻辑升级成独立的Job

在渲染管道中，通过JSON来指定Job的执行顺序

每个渲染管道有自己的数据pipelineState

Job可以拿到每个渲染管道的数据，不过只依赖于管道数据的类型


统一数据、抽象？



解决第二个问题： 在多人开发中，如何让每个人只独立开发自己负责的逻辑，并且能方便地将每个人实现的逻辑集成到渲染中？

现在增加一个开发同学乙，负责实现RenderInMobile管道的前向渲染、Tonemap的Job
甲负责实现RenderInPC管道的所有Job，以及RenderInMobile管道的初始化WebGL1

这里需要实现的是能够合并甲、乙开发的同属于RenderInMobile管道的两个子管道。其中乙实现的两个Job应该在甲实现的Job之后执行，并且乙的Job需要读甲的子管道数据：WebGL1的上下文


    - 遵循哪些设计原则
    - 给出UML？
    - 给出代码？
    registerPipeline
        job order

    支持异步job

    concat/merge


explain:
is_set_state
    now only work with type:"job"

介绍pipeManager实现原理



    - 结合UML图，描述如何具体地解决问题？
    通过Json定制管线

    规范了Job



# 主问题：提出模式


- 设计意图？
- 定义
    - 一句话定义？
    - 描述定义？
    - 通用UML？
    - 分析角色？
    - 角色之间的关系？
    - 角色的抽象代码？
    TODO give pipeline manager abstract code
    - 遵循的设计原则在UML中的体现？


- 应用
    - 优点？

规范

由Client任意定制管线
    - 缺点？
    - 使用场景
系统的初始化、更新、渲染

    - 描述场景？
    - 实现该场景需要修改模式的哪些角色？
    - 使用模式有什么好处？
    - 注意事项？

- 扩展
    - 如何扩展、推广、发散？


    registerPipeline
        config

    <!-- initPipeline
        initFunc -->

    job add config json
        e.g. clear color
    


    extract 配置数据
        pipeline json+job json


- 结合其它模式
    - 结合哪些模式？

<!-- 结合反应模式
    异步job -->



结合积木模式
    pipeline block implement pipeline mechanism

    pipeline block's contribute define pipeline

    - 使用场景是什么？
    - UML如何变化？
    - 代码如何变化？


# 主问题：最佳实践

- 结合具体项目实践经验，如何应用模式来改进项目？
    - 哪些场景不需要使用模式？
    - 哪些场景需要使用模式？
    - 给出具体的实践案例？

    适配各种运行环境

    同时支持WebGL1、WebGL2：两套管线


# 主问题：推荐更多资料

- 推荐更多资料？

FrameGraph
https://www.google.com/search?q=frame+graph&oq=frame+graph&aqs=chrome..69i57j0i10i512l6j69i61.5234j0j7&sourceid=chrome&ie=UTF-8


RenderGraph
https://zhuanlan.zhihu.com/p/425830762