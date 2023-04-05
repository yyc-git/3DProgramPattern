# [引入故事，提出问题]

## 需求


开发一个游戏，游戏世界中有两种人物：普通英雄和超级英雄

普通英雄只能移动
超级英雄除了能够移动，还能飞行

使用Instance来一次性批量渲染所有的普通英雄
一个一个地渲染每个超级英雄


## 给出UML

TODO tu

<!-- World负责游戏世界的管理，它包括了所有的普通英雄和超级英雄数据 -->
World对应游戏世界，由多个普通英雄和多个超级英雄组成，实现了初始化和主循环的逻辑

一个NormalHero对应一个普通英雄，实现了移动

一个SuperHero对应一个超级英雄，实现了移动、飞行


## 给出代码

Client代码:
```ts
let _createScene = (worldState: worldState): worldState => {
    let normalHero1Data = api.normalHero.create()
    let normalHero1 = normalHero1Data[1]

    worldState = addNormalHero(worldState, normalHero1Data)

    let normalHero2Data = api.normalHero.create()
    let normalHero2 = normalHero2Data[1]

    worldState = addNormalHero(worldState, normalHero2Data)


    worldState = api.normalHero.move(worldState, normalHero1)


    let superHero1Data = api.superHero.create()
    let superHero1 = superHero1Data[1]

    worldState = addSuperHero(worldState, superHero1Data)

    let superHero2Data = api.superHero.create()
    let superHero2 = superHero2Data[1]

    worldState = addSuperHero(worldState, superHero2Data)


    worldState = api.superHero.move(worldState, superHero1)
    worldState = api.superHero.fly(worldState, superHero1)


    return worldState
}

let worldState = createState()

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState)
```

我们首先创建了WorldState，用来保存所有的数据；
然后创建了场景，场景包括两个普通英雄和两个超级英雄，其中第一个普通英雄进行了移动，第一个超级英雄进行了移动和飞行；
然后进行初始化；
最后开始主循环


我们首先来看下World的createState代码：
```ts
export let createState = (): worldState => {
    return {
        normalHeros: Map(),
        superHeros: Map()
    }
}
```

createState函数创建并返回了WorldState，它包含两个分别用来保存NormalHero和SuperHero的容器



然后我们来看下创建场景相关代码：
WorldUtils
```ts
export let setNormalHeroState = (worldState: worldState, normalHero: normalHero, normalHeroState: normalHeroState) => {
    return {
        ...worldState,
        normalHeros: worldState.normalHeros.set(normalHero, normalHeroState)
    }
}

export let setSuperHeroState = (worldState: worldState, superHero: superHero, superHeroState: superHeroState) => {
    return {
        ...worldState,
        superHeros: worldState.superHeros.set(superHero, superHeroState)
    }
}
```

World
```ts
export let addNormalHero = (worldState: worldState, [normalHeroState, normalHero]): worldState => {
    return setNormalHeroState(worldState, normalHero, normalHeroState)
}

export let addSuperHero = (worldState: worldState, [superHeroState, superHero]): worldState => {
    return setSuperHeroState(worldState, superHero, superHeroState)
}

...

export let api = {
    normalHero: {
        create: NormalHero.create,
        move: NormalHero.move
    },
    superHero: {
        create: SuperHero.create,
        move: SuperHero.move,
        fly: SuperHero.fly
    }
}
```

normalHero、superHero其实就是一个number类型的id值，
normalHeroState、superHeroState分别保存了一个普通英雄、一个超级英雄的数据（比如position、velocity）

normalHero与normalHeroState关联，这个关联体现在前者是WorldState->normalHeros这个Map的Key，后者是Value
同理，superHero与superHeroState关联

World封装了操作Hero的API

NormalHero的相关代码如下：
WorldUtils
```ts
export let getNormalHeroState = (worldState: worldState, normalHero: normalHero): normalHeroState => {
    return worldState.normalHeros.get(normalHero)
}

export let setNormalHeroState = (worldState: worldState, normalHero: normalHero, normalHeroState: normalHeroState) => {
    return {
        ...worldState,
        normalHeros: worldState.normalHeros.set(normalHero, normalHeroState)
    }
}
```

NormalHero
```ts
export let create = (): [normalHeroState, normalHero] => {
    let normalHeroState: normalHeroState = {
        position: [0, 0, 0],
        velocity: 1.0
    }

    let id = generateId()

    return [
        normalHeroState,
        id
    ]
}

...

export let move = (worldState: worldState, normalHero: normalHero): worldState => {
    let normalHeroState = getNormalHeroState(worldState, normalHero)

    let { position, velocity } = normalHeroState

    let [x, y, z] = position

    return setNormalHeroState(worldState, normalHero,
        {
            ...normalHeroState,
            position: [x + velocity, y + velocity, z + velocity]
        }
    )
}
```

move函数更新了normalHero的position

SuperHero的相关代码如下：
WorldUtils
```ts
export let getSuperHeroState = (worldState: worldState, superHero: superHero): superHeroState => {
    return worldState.superHeros.get(superHero)
}


export let setSuperHeroState = (worldState: worldState, superHero: superHero, superHeroState: superHeroState) => {
    return {
        ...worldState,
        superHeros: worldState.superHeros.set(superHero, superHeroState)
    }
}
```
SuperHero
```ts
export let create = (): [superHeroState, superHero] => {
    let superHeroState: superHeroState = {
        position: [0, 0, 0],
        velocity: 1.0,
        maxFlyVelocity: 10.0
    }

    let id = generateId()

    return [
        superHeroState,
        id
    ]
}

export let move = (worldState: worldState, superHero: superHero): worldState => {
    let superHeroState = getSuperHeroState(worldState, superHero)

    let { position, velocity } = superHeroState

    let [x, y, z] = position

    return setSuperHeroState(worldState, superHero,
        {
            ...superHeroState,
            position: [x + velocity, y + velocity, z + velocity]
        }
    )
}

export let fly = (worldState: worldState, superHero: superHero): worldState => {
    let superHeroState = getSuperHeroState(worldState, superHero)

    let { position, velocity, maxFlyVelocity } = superHeroState

    let [x, y, z] = position

    velocity = velocity < maxFlyVelocity ? (velocity * 2.0) : maxFlyVelocity

    return setSuperHeroState(worldState, superHero,
        {
            ...superHeroState,
            position: [x + velocity, y + velocity, z + velocity]
        }
    )
}
```

superHero的move的逻辑跟normalHero的move一样

fly函数跟move函数一样，也是更新了superHero的position，只是因为两者使用的速度不一样，所以更新的幅度不同




然后我们来看下初始化相关代码：
World
```ts
export let init = (worldState: worldState): worldState => {
    console.log("初始化...")

    return worldState
}
```


最后我们来看下主循环相关代码：
World
```ts
let _update = (worldState: worldState): worldState => {
    return {
        normalHeros: worldState.normalHeros.map(normalHeroState => {
            return NormalHero.update(normalHeroState)
        }),
        superHeros: worldState.superHeros.map(superHeroState => {
            return SuperHero.update(superHeroState)
        })
    }
}

...

export let loop = (worldState: worldState) => {
    worldState = _update(worldState)
    _renderOneByOne(worldState)
    _renderInstances(worldState)

    console.log(JSON.stringify(worldState))

    requestAnimationFrame(
        (time) => {
            loop(worldState)
        }
    )
}
```

在每次主循环中，首先进行update，然后进行渲染

update会遍历所有的normalHeros和superHeros，调用它们的update函数来更新自己


我们看下NormalHero的update代码：
```ts
export let update = (normalHeroState: normalHeroState): normalHeroState => {
    console.log("更新NormalHero")

    let [x, y, z] = normalHeroState.position

    //更新position（如更新世界坐标系中的position）...
    let newPosition: [number, number, number] = [x * 2.0, y * 2.0, z * 2.0]

    return {
        ...normalHeroState,
        position: newPosition
    }
}
```

这里会更新自己的position


我们看下SuperHero的update代码：
```ts
export let update = (superHeroState: superHeroState): superHeroState => {
    console.log("更新SuperHero")

    let [x, y, z] = superHeroState.position

    //更新position（如更新世界坐标系中的position）...
    let newPosition: [number, number, number] = [x * 2.0, y * 2.0, z * 2.0]


    return {
        ...superHeroState,
        position: newPosition
    }
}
```

它的逻辑跟NormalHero的update是一样的，这是因为两者都使用同样的算法来更新自己的position


我们回到主循环代码，来看下渲染相关的代码：
```ts
let _renderOneByOne = (worldState: worldState): void => {
    worldState.superHeros.forEach(superHeroState => {
        console.log("OneByOne渲染 SuperHero...")
    })
}

let _renderInstances = (worldState: worldState): void => {
    let normalHeroStates = worldState.normalHeros

    console.log("批量Instance渲染 NormalHeros...")
}

...

export let loop = (worldState: worldState) => {
    ...
    _renderOneByOne(worldState)
    _renderInstances(worldState)
    ...
}
```

渲染时，首先调用_renderOneByOne函数来一个一个地渲染每个超级英雄；然后调用_renderInstances来一次性渲染所有的普通英雄



## 提出问题

- NormalHero和SuperHero中的update、move函数是重复的逻辑

- 随着功能的增加，NormalHero和SuperHero模块的逻辑也会越来越复杂，不方便维护


# [解决问题的方案，分析存在的问题]?


## 概述解决方案？

TODO continue

## 给出UML？
## 结合UML图，描述如何具体地解决问题？
## 给出代码？


## 请分析存在的问题?
## 提出改进方向？


# [给出可能的改进方案，分析存在的问题]?



## 概述解决方案？
## 给出UML？
## 结合UML图，描述如何具体地解决问题？
## 给出代码？


## 请分析存在的问题?
## 提出改进方向？


# [给出使用模式的改进方案]

## 概述解决方案
## 给出UML？
## 结合UML图，描述如何具体地解决问题？
## 给出代码？



<!-- # 设计意图

阐明模式的设计目标 -->

# 定义

## 一句话定义？
<!-- ## 概述抽象的解决方案 -->
## 补充说明
## 通用UML？
## 分析角色？
## 角色之间的关系？
## 角色的抽象代码？
## 遵循的设计原则在UML中的体现？




# 应用

## 优点

## 缺点

## 使用场景

### 场景描述

<!-- ### 解决方案 -->

### 具体案例

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
<!-- ## 哪些场景需要使用模式？ -->
## 给出具体的实践案例？



# 更多资料推荐
