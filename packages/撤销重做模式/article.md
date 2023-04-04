[TOC]

# [引入故事，提出问题]

## 需求

<!-- 编辑器实现了Move操作，该操作会操作引擎、更新编辑器中与逻辑相关的数据、更新编辑器的UI -->
编辑器实现了Move操作，该操作会操作子系统，更新它们的数据

现在需要实现该操作的撤销/重做功能

## 实现思路

使用命令模式，编辑器的每个操作都是一个命令

进行Move操作时，首先创建Move命令；然后拷贝执行前的数据，保存在命令中；然后执行命令来更新数据；最后保存命令到撤销堆栈中

撤销时，首先从撤销堆栈中得到最近保存的命令；然后撤销该命令，它会恢复为执行前的数据；最后将该命令保存重做堆栈中

重做时，首先从重做堆栈中得到最近保存的命令；然后执行该命令来更新数据；最后将该命令保存撤销堆栈中



## 给出UML

TODO tu

编辑器的子系统包括引擎-Engine、编辑器逻辑-EngineLogic、编辑器UI-EditorUI

MoveCommand对应编辑器的Move操作，负责与子系统交互，拷贝了它们数据

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

子系统的每个模块都只有一个数据data1

printAllData函数打印了它们的数据data1

下面是子系统相关代码：
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

该命令将执行命令前的子系统每个模块的data1数据分别拷贝到闭包的_engineData1Before、_editorLogicData1Before、_editorUIData1Before中

exec函数实现了执行命令，它首先拷贝数据；最后执行子系统每个模块的逻辑

我们看下子系统相关代码：
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

CommandManager将撤销堆栈、重做堆栈保存在闭包中


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

在执行move操作前，子系统每个模块的data1都为初始值：0

执行move后，操作了dom来绘制，并且子系统每个模块的data1分别更新为1、2、3

撤销后，操作了dom来撤销绘制，
执行move后，操作了dom来绘制，并且子系统每个模块的data1都恢复为初始值0

重做后，操作了dom来绘制，并且子系统每个模块的data1再次更新为1、2、3





## 提出问题

- 因为命令需要知道子系统数据的拷贝、撤销的逻辑，所以每当修改子系统数据时，所有涉及到该数据的命令都需要对应修改
<!-- 在命令执行时，命令需要知道如何如何获得和保存更新前的数据；在命令撤销时，命令需要知道如何撤销数据 -->



# [给出使用模式的改进方案]

## 概述解决方案

将子系统中每个模块的数据集中起来保存在对应的state中，然后一起保存在编辑器的EditorState中；

确保每个模块的state中的数据尽量为不可变数据；

因为不可变数据是唯一的，没有共享状态，所以在撤销、重做时不需要进行拷贝等操作；
反之，对于每个模块的state中的可变数据，则需要实现它们的拷贝和恢复的逻辑；

在撤销或者重做时，只需要把当前的EditorState替换为对应的EditorState



## 给出UML？
TODO tu


EditorState是编辑器的state数据，包括了三个子系统模块的state：EngineState、EditorLogicState、EditorUIState
其中EngineState包括了不可变和可变数据，另外两个模块的state只有不可变数据
这是因为EngineState将会有WebGLBuffer这种图形API创建的对象，它是可变数据；除此以外还有些性能热点的数据也是可变数据，所以EngineState需要有可变数据

EditorState还包括了每个子系统模块对应的撤销堆栈和重做堆栈，它们用来保存子系统模块的state

在子系统的模块中，Engine模块相比其它两个模块，多出了deepCopy和restore函数，它们分别用来深拷贝和恢复EngineState中的可变数据


子系统的EditorUI可以使用React或者Vue作为UI框架，从而不再需要直接操作dom了，而是只操作数据即可


RedoUndoManager负责管理EditorState，维护了EditorState中的撤销和重做堆栈



## 结合UML图，描述如何具体地解决问题？

- 每当修改子系统的不可变数据时，因为它不需要拷贝或者撤销，所以系统不需要任何修改
- 每当修改子系统的可变数据时，如修改EngineState的可变数据时，则只需要修改Engine的deepCopy和restore函数


## 给出代码？


Client代码:
```ts
let state =  createState()

printAllData(state)

state = move(state)

printAllData(state)

state = undo(state)

printAllData(state)

state = redo(state)

printAllData(state)

```

这里跟之前类似

这里跟之前不一样的地方是首先创建了EditorState，然后每一步的函数都传入和返回了EditorState


我们看下Editor的createState代码：
```ts
export type state = {
    engineStatesForUndo: Stack<Engine.state>,
    engineStatesForRedo: Stack<Engine.state>,
    editorLogicStatesForUndo: Stack<EditorLogic.state>,
    editorLogicStatesForRedo: Stack<EditorLogic.state>,
    editorUIStatesForUndo: Stack<EditorUI.state>,
    editorUIStatesForRedo: Stack<EditorUI.state>,
    engineState: Engine.state,
    editorLogicState: EditorLogic.state,
    editorUIState: EditorUI.state
}

export let createState = (): state => {
    return {
        engineStatesForUndo: Stack(),
        engineStatesForRedo: Stack(),
        editorLogicStatesForUndo: Stack(),
        editorLogicStatesForRedo: Stack(),
        editorUIStatesForUndo: Stack(),
        editorUIStatesForRedo: Stack(),
        engineState: Engine.createState(),
        editorLogicState: EditorLogic.createState(),
        editorUIState: EditorUI.createState()
    }
}
```

createState函数创建并返回了EditorState，它包含子系统模块的state，以及对应的撤销、重做堆栈


我们看下Editor的printAllData代码：
```ts
export let printAllData = ({ engineState, editorLogicState, editorUIState }: state) => {
    console.log("Engine->state:", engineState)
    console.log("EditorLogic->state:", editorLogicState)
    console.log("EditorUI->state:", editorUIState)
}
```

printAllData函数打子系统模块的state

<!-- 我们看下Editor的move以及RedoUndoManager相关的代码：
Editor -->
我们看下Editor的move代码：
```ts
export let move = (state: state) => {
    console.log("move")

    state = pushEditorState(state)

    let engineState = Engine.doWhenMove(state.engineState)
    let editorLogicState = EditorLogic.doWhenMove(state.editorLogicState)
    let editorUIState = EditorUI.doWhenMove(state.editorUIState)

    return {
        ...state,
        engineState,
        editorLogicState,
        editorUIState
    }
}
```

这里首先保存了EditorState；
然后执行子系统每个模块的操作；
最后更新EditorState中子系统每个模块的state

我们看下RedoUndoManager中保存EditorState的代码：
```ts
export let pushEditorState = (editorState: Editor.state): Editor.state => {
    return {
        ...editorState,
        engineStatesForUndo: editorState.engineStatesForUndo.push(
            Engine.deepCopy(editorState.engineState)
        ),
        editorLogicStatesForUndo: editorState.editorLogicStatesForUndo.push(editorState.editorLogicState),
        editorUIStatesForUndo: editorState.editorUIStatesForUndo.push(editorState.editorUIState),
        engineStatesForRedo: Stack(),
        editorLogicStatesForRedo: Stack(),
        editorUIStatesForRedo: Stack()
    }
}
```

这里将子系统每个模块的state保存到对应的撤销堆栈中

其中因为EngineState有可变数据，所以进行了深拷贝

我们看下Engine中深拷贝相关代码：
```ts
//一些字段是immutable，另外的字段是mutable
export type state = {
    immutableData1: number,
    mutableData2: Array<number>
}

export let createState = (): state => {
    return {
        immutableData1: 0,
        mutableData2: [1]
    }
}

export let doWhenMove = (state: state) => {
    state = {
        ...state,
        immutableData1: state.immutableData1 + 1
    }

    state.mutableData2.push(1)

    return state
}

//深拷贝mutable的字段
export let deepCopy = (state: state): state => {
    return {
        ...state,
        mutableData2: state.mutableData2.slice()
    }
}
```

deepCopy函数只对可变字段mutableData2进行了深拷贝；其它不可变的字段则没有被拷贝，而是直接被赋值到新的state中


我们再看下另外两个模块的相关代码：
EditorLogic
```ts
//所有字段都应该是immutable
export type state = {
    data1: number
}

export let createState = (): state => {
    return {
        data1: 0
    }
}

export let doWhenMove = (state: state) => {
    return {
        ...state,
        data1: state.data1 + 2
    }
}
```
EditorUI
```ts
//所有字段都应该是immutable
export type state = {
    data1: number
}

export let createState = (): state => {
    return {
        data1: 0
    }
}

export let doWhenMove = (state: state) => {
    return {
        ...state,
        data1: state.data1 + 3
    }
}
```




我们继续看Editor剩余代码：
```ts
export let undo = (state: state) => {
    console.log("undo")

    return undoRedoUndoManager(state)
}

export let redo = (state: state) => {
    console.log("redo")

    return redoRedoUndoManager(state)
}
```

它分别调用了RedoUndoManager的undo、redo函数


RedoUndoManager的undo代码如下
```ts
export let undo = (editorState: Editor.state): Editor.state => {
    let previousEngineState = editorState.engineStatesForUndo.first()
    let engineStatesForUndo = editorState.engineStatesForUndo.pop()

    //深拷贝
    let engineStatesForRedo = editorState.engineStatesForRedo.push(Engine.deepCopy(editorState.engineState))

    //恢复
    previousEngineState = Engine.restore(editorState.engineState, previousEngineState)


    let previousEditorLogicState = editorState.editorLogicStatesForUndo.first()
    let editorLogicStatesForUndo = editorState.editorLogicStatesForUndo.pop()

    let editorLogicStatesForRedo = editorState.editorLogicStatesForRedo.push(editorState.editorLogicState)

    EditorUIState的逻辑跟EditorLogicState的逻辑一样，故省略...

    return {
        ...editorState,
        engineStatesForUndo,
        editorLogicStatesForUndo,
        ...
        engineStatesForRedo,
        editorLogicStatesForRedo,
        ...

        //替换当前子系统各个模块的state
        engineState: previousEngineState,
        editorLogicState: previousEditorLogicState,
        ...
    }
}
```


这里将当前子系统各个模块的state保存到对应的重做堆栈中；并将保存在对应的撤销堆栈的子系统各个模块的state取出来，替换为新的当前的子系统各个模块的state

值得注意的是由于引擎的EngineState有可变数据，所以对其进行了深拷贝和恢复操作


RedoUndoManager的redo与undo类似，代码如下
```ts
export let redo = (editorState: Editor.state): Editor.state => {
    ...

    let nextEngineState = editorState.engineStatesForRedo.first()
    let engineStatesForRedo = editorState.engineStatesForRedo.pop()

    //深拷贝
    let engineStatesForUndo = editorState.engineStatesForUndo.push(Engine.deepCopy(editorState.engineState))

    //恢复
    nextEngineState = Engine.restore(editorState.engineState, nextEngineState)


    let nextEditorLogicState = editorState.editorLogicStatesForRedo.first()
    let editorLogicStatesForRedo = editorState.editorLogicStatesForRedo.pop()

    let editorLogicStatesForUndo = editorState.editorLogicStatesForUndo.push(editorState.editorLogicState)

    EditorUIState的逻辑跟EditorLogicState的逻辑一样，故省略...

    return {
        ...editorState,
        engineStatesForUndo,
        editorLogicStatesForUndo,
        ...
        engineStatesForRedo,
        editorLogicStatesForRedo,
        ...

        //替换当前子系统各个模块的state
        engineState: nextEngineState,
        editorLogicState: nextEditorLogicState,
        ...
    }
}
```


下面，我们运行代码，运行结果如下：
```text
Engine->state: { immutableData1: 0, mutableData2: [ 1 ] }
EditorLogic->state: { data1: 0 }
EditorUI->state: { data1: 0 }
move
Engine->state: { immutableData1: 1, mutableData2: [ 1, 1 ] }
EditorLogic->state: { data1: 2 }
EditorUI->state: { data1: 3 }
undo
Engine->state: { immutableData1: 0, mutableData2: [ 1 ] }
EditorLogic->state: { data1: 0 }
EditorUI->state: { data1: 0 }
redo
Engine->state: { immutableData1: 1, mutableData2: [ 1, 1 ] }
EditorLogic->state: { data1: 2 }
EditorUI->state: { data1: 3 }
```

运行结果与之前一样，只是打印的值不一样
通过了运行测试


<!-- # 设计意图

阐明模式的设计目标 -->

# 定义

## 一句话定义？

替换不可变数据

## 描述定义？


将数据集中起来保存在state中

确保state中的数据尽量为不可变数据

在撤销或者重做时，只需要把当前的state替换为对应的state


## 通用UML？

TODO tu


## 分析角色？


我们来看看模式的相关角色：

- ImmutableSubSystem
该角色属于子系统的一个模块，它的state数据只有不可变数据

- ImmutableAndMutableSubSystem
该角色属于子系统的一个模块，它的state数据既包括不可变数据又包括可变数据
其中，图形API创建的对象、性能热点数据为可变数据；其它数据为不可变数据
该角色相比ImmutableSubSystem，需要多实现deepCopy、restore这两个函数，分别用来深拷贝和恢复state中的可变数据

- SystemState
该角色是系统System的state数据，包含了子系统所有模块的state，以及每个子系统模块对应的撤销堆栈和重做堆栈，这些堆栈用来保存子系统对应模块的state

- RedoUndoManager
该角色负责管理SystemState，维护了SystemState中的撤销和重做堆栈




## 角色之间的关系？

- System只有一个SystemState

- 子系统可以有多个ImmutableAndMutableSubSystem模块和多个ImmutableSubSystem模块

- 每个子系统只有一个SubSystemState，它们保存在SystemState中

- 每个SubSystemState对应一个撤销堆栈和重做堆栈


## 角色的抽象代码？


下面我们来看看各个角色的抽象代码：

- Client的抽象代码
```ts
let state = createState()

state = doSomething(state)

state = undo(state)

state = redo(state)

```

- System的抽象代码
```ts
export type state = {
    immutableAndMutableSubSystem1StatesForUndo: Stack<ImmutableAndMutableSubSystem1.state>,
    immutableAndMutableSubSystem1StatesForRedo: Stack<ImmutableAndMutableSubSystem1.state>,
    immutableSubSystem1StatesForUndo: Stack<ImmutableSubSystem1.state>,
    immutableSubSystem1StatesForRedo: Stack<ImmutableSubSystem1.state>,
    immutableAndMutableSubSystem1State: ImmutableAndMutableSubSystem1.state,
    immutableSubSystem1State: ImmutableSubSystem1.state,
}

export let createState = (): state => {
    return {
        immutableAndMutableSubSystem1StatesForUndo: Stack(),
        immutableAndMutableSubSystem1StatesForRedo: Stack(),
        immutableSubSystem1StatesForUndo: Stack(),
        immutableSubSystem1StatesForRedo: Stack(),
        immutableAndMutableSubSystem1State: ImmutableAndMutableSubSystem1.createState(),
        immutableSubSystem1State: ImmutableSubSystem1.createState(),
    }
}

export let doSomething = (state: state) => {
    state = pushSystemState(state)

    let immutableAndMutableSubSystem1State = ImmutableAndMutableSubSystem1.doSomething(state.immutableAndMutableSubSystem1State)

    let immutableSubSystem1State = ImmutableSubSystem1.doSomething(state.immutableSubSystem1State)

    return {
        ...state,
        immutableAndMutableSubSystem1State,
        immutableSubSystem1State
    }
}

export let undo = (state: state) => {
    return undoRedoUndoManager(state)
}

export let redo = (state: state) => {
    return redoRedoUndoManager(state)
}
```

- ImmutableSubSystem的抽象代码
```ts
//所有字段都应该是immutable
export type state = {
    immutable数据: xxx,
}

export let createState = (): state => {
    return {
        immutable数据: 初始值1,
    }
}

export let doSomething = (state: state) => {
    return {
        ...state,
        immutable数据: 更新immutable数据(state.immutable数据)
    }
}
```

- ImmutableAndMutableSubSystem的抽象代码
```ts
//一些字段是immutable，另外的字段是mutable
export type state = {
    immutable数据: xxx,
    mutable数据: xxx
}

export let createState = (): state => {
    return {
        immutable数据: 初始值1,
        mutable数据: 初始值2
    }
}

export let doSomething = (state: state) => {
    state = {
        ...state,
        immutable数据: 更新immutable数据(state.immutable数据)
    }

    更新mutable数据(state.mutable数据)

    return state
}

export let deepCopy = (state: state): state => {
    return {
        ...state,
        mutable数据: 深拷贝(state.mutable数据)
    }
}

export let restore = (currentState: state, targetState: state): state => {
    console.log("处理currentState中与targetState共享的数据（如图形API的对象：WebGLBuffer），然后将处理结果重新共享到targetState")

    return targetState
}
```

- RedoUndoManager的抽象代码
```ts
export let pushSystemState = (systemState: System.state): System.state => {
    return {
        ...systemState,
        immutableAndMutableSubSystem1StatesForUndo: systemState.immutableAndMutableSubSystem1StatesForUndo.push(
            ImmutableAndMutableSubSystem1.deepCopy(systemState.immutableAndMutableSubSystem1State)
        ),
        immutableSubSystem1StatesForUndo: systemState.immutableSubSystem1StatesForUndo.push(
            systemState.immutableSubSystem1State
        ),
        immutableAndMutableSubSystem1StatesForRedo: Stack(),
        immutableSubSystem1StatesForRedo: Stack(),
    }
}

export let undo = (systemState: System.state): System.state => {
    let previousImmutableAndMutableSubSystem1State = systemState.immutableAndMutableSubSystem1StatesForUndo.first()
    let immutableAndMutableSubSystem1StatesForUndo = systemState.immutableAndMutableSubSystem1StatesForUndo.pop()

    let immutableAndMutableSubSystem1StatesForRedo = systemState.immutableAndMutableSubSystem1StatesForRedo.push(ImmutableAndMutableSubSystem1.deepCopy(systemState.immutableAndMutableSubSystem1State))

    previousImmutableAndMutableSubSystem1State = ImmutableAndMutableSubSystem1.restore(systemState.immutableAndMutableSubSystem1State, previousImmutableAndMutableSubSystem1State)


    let previousImmutableSubSystem1State = systemState.immutableSubSystem1StatesForUndo.first()
    let immutableSubSystem1StatesForUndo = systemState.immutableSubSystem1StatesForUndo.pop()

    let immutableSubSystem1StatesForRedo = systemState.immutableSubSystem1StatesForRedo.push(systemState.immutableSubSystem1State)

    return {
        ...systemState,
        immutableAndMutableSubSystem1StatesForUndo,
        immutableSubSystem1StatesForUndo,
        immutableAndMutableSubSystem1StatesForRedo,
        immutableSubSystem1StatesForRedo,

        //替换当前子系统各个模块的state
        immutableAndMutableSubSystem1State: previousImmutableAndMutableSubSystem1State,
        immutableSubSystem1State: previousImmutableSubSystem1State
    }
}

export let redo = (systemState: System.state): System.state => {
    if (systemState.immutableAndMutableSubSystem1StatesForRedo.size === 0) {
        console.log("do nothing")

        return systemState
    }

    let nextImmutableAndMutableSubSystem1State = systemState.immutableAndMutableSubSystem1StatesForRedo.first()
    let immutableAndMutableSubSystem1StatesForRedo = systemState.immutableAndMutableSubSystem1StatesForRedo.pop()

    let immutableAndMutableSubSystem1StatesForUndo = systemState.immutableAndMutableSubSystem1StatesForUndo.push(ImmutableAndMutableSubSystem1.deepCopy(systemState.immutableAndMutableSubSystem1State))

    nextImmutableAndMutableSubSystem1State = ImmutableAndMutableSubSystem1.restore(systemState.immutableAndMutableSubSystem1State, nextImmutableAndMutableSubSystem1State)


    let nextImmutableSubSystem1State = systemState.immutableSubSystem1StatesForRedo.first()
    let immutableSubSystem1StatesForRedo = systemState.immutableSubSystem1StatesForRedo.pop()

    let immutableSubSystem1StatesForUndo = systemState.immutableSubSystem1StatesForUndo.push(systemState.immutableSubSystem1State)

    return {
        ...systemState,
        immutableAndMutableSubSystem1StatesForUndo,
        immutableSubSystem1StatesForUndo,
        immutableAndMutableSubSystem1StatesForRedo,
        immutableSubSystem1StatesForRedo,

        //替换当前子系统各个模块的state
        immutableAndMutableSubSystem1State: nextImmutableAndMutableSubSystem1State,
        immutableSubSystem1State: nextImmutableSubSystem1State
    }
}
```



## 遵循的设计原则在UML中的体现？

TODO finish



# 应用

## 优点

TODO continue

## 缺点

## 使用场景


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
