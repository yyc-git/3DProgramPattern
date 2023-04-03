# [引入故事，提出问题]

## 需求

编辑器实现了Move操作，该操作会操作引擎、更新编辑器中与逻辑相关的数据、更新编辑器的UI

现在需要实现该操作的撤销/重做功能

## 实现思路

使用命令模式，编辑器的每个操作都是一个命令

进行Move操作时，首先创建Move命令；然后将执行前的数据保存在命令中；然后执行命令来更新数据；最后保存命令到撤销堆栈中

撤销时，首先从撤销堆栈中得到最近保存的命令；然后撤销该命令，它会恢复保存的执行前的数据；最后将该命令保存重做堆栈中

重做时，首先从重做堆栈中得到最近保存的命令；然后执行该命令来更新数据；最后将该命令保存撤销堆栈中



## 给出UML

TODO tu

MoveCommand对应编辑器的Move操作，会调用引擎、编辑器逻辑、编辑器UI模块来更新它们的数据，并且保存了更新它们前的数据

CommandManager负责管理所有的命令，维护了撤销和重做的命令堆栈


## 给出代码

Client代码:
```ts
//打印引擎、编辑器逻辑、编辑器UI的数据
printAllData()

move()

printAllData()

undo()

printAllData()

redo()

printAllData()
```

我们首先执行编辑器的move操作；
然后撤销该操作；
最后重做该操作

每一步我们都打印了当前的数据，用来检查是否通过了运行测试


Editor代码：
```ts
export let printAllData = () => {
    console.log("Engine->data1:", Engine.getData1())
    console.log("EditorLogic->data1:", EditorLogic.getData1())
    console.log("EditorUI->data1:", EditorUI.getData1())
}
```

Engine、EditorLogic、EditorUI都只有一个数据data1

printAllData函数打印了它们的数据data1

下面是Engine、EditorLogic、EditorUI相关代码：
Engine
```ts
let _data1: number = 0

export let getData1 = () => {
    return _data1
}

export let setData1 = (data1) => {
    _data1 = data1
}
```
EditorLogic
```ts
let _data1: number = 0

export let getData1 = () => {
    return _data1
}

export let setData1 = (data1) => {
    _data1 = data1
}
```
EditorUI
```ts
let _data1: number = 0

export let getData1 = () => {
    return _data1
}

export let setData1 = (data1) => {
    _data1 = data1
}
```

数据data1保存在闭包中

我们继续看Editor的代码：
Editor
```ts
export let move = () => {
    console.log("move")

    let moveCommand = createCommand()

    moveCommand.exec()

    pushCommand(moveCommand)
}
```

该函数首先创建了Move命令；然后执行命令；最后保存命令到CommandManager的撤销堆栈中

我们看下MoveCommand相关代码：
MoveCommand
```ts
let _engineData1Before: number
let _editorLogicData1Before: number
let _editorUIData1Before: number

export let createCommand = (): command => {
    return {
        exec: () => {
            _engineData1Before = Engine.getData1()
            _editorLogicData1Before = EditorLogic.getData1()
            _editorUIData1Before = EditorUI.getData1()

            Engine.doWhenMove()
            EditorLogic.doWhenMove()
            EditorUI.doWhenMove()
        },
        ...
    }
}
```

该命令将执行命令前的Engine、EditorLogic、EditorUI的data1数据保存在闭包中

exec函数实现了执行命令，它首先保存数据；最后执行Engine、EditorLogic、EditorUI的逻辑

我们看下Engine、EditorLogic、EditorUI相关代码：
Engine
```ts
export let doWhenMove = () => {
    _data1 += 1
}
```
EditorLogic
```ts
export let doWhenMove = () => {
    _data1 += 2
}
```
EditorUI
```ts
export let draw = () => {
    console.log("operate dom to draw")
}

export let doWhenMove = () => {
    _data1 += 3

    draw()
}
```

它们都更新了数据data1，只是更新的值不一样

另外，EditorUI还操作了dom，模拟绘制逻辑


我们看下CommandManager相关代码：
```ts
let _commandsForUndo: Array<command> = []

let _commandsForRedo: Array<command> = []

export let pushCommand = (command: command) => {
    _commandsForUndo.push(command)
    _commandsForRedo = []
}
```

CommandManager将将撤销堆栈、重做堆栈保存在闭包中


我们继续看Editor剩余代码：
```ts
export let undo = () => {
    console.log("undo")

    undoCommandManager()
}

export let redo = () => {
    console.log("redo")

    redoCommandManager()
}
```

它分别调用了CommandManager的undo、redo函数

我们看下CommandManager、MoveCommand、EditorUI相关代码：
CommandManager
```ts
export let undo = () => {
    let command = _commandsForUndo.pop()

    command.undo()

    _commandsForRedo.push(command)
}

export let redo = () => {
    if (_commandsForRedo.length === 0) {
        console.log("do nothing")
        return
    }

    let command = _commandsForRedo.pop()

    command.exec()

    _commandsForUndo.push(command)
}
```
MoveCommand
```ts
        undo: () => {
            Engine.setData1(_engineData1Before)
            EditorLogic.setData1(_editorLogicData1Before)
            EditorUI.setData1(_editorUIData1Before)

            EditorUI.undraw()
        }
```
EditorUI
```ts
export let undraw = () => {
    console.log("operate dom to undraw")
}
```

MoveCommand的undo函数中，通过调用EditorUI的undraw函数来撤销EditorUI的绘制


下面，我们运行代码，运行结果如下：
```text
Engine->data1: 0
EditorLogic->data1: 0
EditorUI->data1: 0
move
operate dom to draw
Engine->data1: 1
EditorLogic->data1: 2
EditorUI->data1: 3
undo
operate dom to undraw
Engine->data1: 0
EditorLogic->data1: 0
EditorUI->data1: 0
redo
operate dom to draw
Engine->data1: 1
EditorLogic->data1: 2
EditorUI->data1: 3
```

在执行move操作前，Engine、EditorLogic、EditorUI的data1都为初始值：0

执行move后，操作了dom来绘制，并且Engine、EditorLogic、EditorUI的data1分别更新为1、2、3

撤销后，操作了dom来撤销绘制，
执行move后，操作了dom来绘制，并且Engine、EditorLogic、EditorUI的data1都恢复为初始值0

重做后，操作了dom来绘制，并且Engine、EditorLogic、EditorUI的data1再次更新为1、2、3





## 提出问题

- 命令需要知道数据的获得、保存、撤销的逻辑。所以每当修改数据时，所有涉及到该数据的命令都需要对应修改
在命令执行时，命令需要知道如何如何获得和保存更新前的数据；在命令撤销时，命令需要知道如何撤销数据



# [给出使用模式的改进方案]

## 概述解决方案

TODO continue



## 给出UML？
## 结合UML图，描述如何具体地解决问题？

TODO 不需要知道数据的获得、保存、撤销的逻辑

## 给出代码？



<!-- # 设计意图

阐明模式的设计目标 -->

# 定义

## 一句话定义？
## 描述定义？
## 通用UML？
## 分析角色？
## 角色之间的关系？
## 角色的抽象代码？
## 遵循的设计原则在UML中的体现？




# 应用

## 优点

## 缺点

## 使用场景


<!-- ## 实现该场景需要修改模式的哪些角色？ -->
<!-- ## 使用模式有什么好处？ -->

## 注意事项


# 扩展


# 结合其它模式

## 结合哪些模式？
## 使用场景是什么？
## UML如何变化？
## 代码如何变化？




# 最佳实践

<!-- ## 结合具体项目实践经验，如何应用模式来改进项目？ -->
## 哪些场景不需要使用模式？
## 哪些场景需要使用模式？
## 给出具体的实践案例？



# 更多资料推荐
