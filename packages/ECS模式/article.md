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

loop(worldState, [update, renderOneByOne, renderInstances])
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

createState函数创建并返回了WorldState，它包含两个分别用来保存所有的NormalHero和所有的SuperHero的容器



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

normalHero、superHero其实就是一个number类型的id值
normalHeroState、superHeroState分别保存了一个普通英雄、一个超级英雄的数据（比如position、velocity）

normalHero与normalHeroState一一关联，这个关联体现在前者是WorldState->normalHeros这个Map的Key，后者是Value
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

move函数实现了移动的逻辑，更新了normalHero的position

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

fly函数实现了飞行的逻辑，它跟move函数一样也是更新了superHero的position，只是因为两者使用的速度不一样，所以更新的幅度不同



现在回到Client，继续看创建场景之后的逻辑
Client
```ts
worldState = init(worldState)

loop(worldState, [update, renderOneByOne, renderInstances])
```

初始化init函数中没有任何逻辑，只是进行了打印


我们来看下主循环相关代码：
ecs_pattern_utils->World
```ts
export let loop = (worldState, [update, renderOneByOne, renderInstances]) => {
    worldState = update(worldState)
    renderOneByOne(worldState)
    renderInstances(worldState)

    console.log(JSON.stringify(worldState))

    requestAnimationFrame(
        (time) => {
            loop(worldState, [update, renderOneByOne, renderInstances])
        }
    )
}
```
World
```ts
export let update = (worldState: worldState): worldState => {
    return {
        normalHeros: worldState.normalHeros.map(normalHeroState => {
            return NormalHero.update(normalHeroState)
        }),
        superHeros: worldState.superHeros.map(superHeroState => {
            return SuperHero.update(superHeroState)
        })
    }
}
```

在每次主循环中，首先进行更新，然后进行渲染

更新update函数会遍历所有的normalHero和superHero，调用它们的update函数来更新自己


我们看下NormalHero的update代码：
```ts
export let update = (normalHeroState: normalHeroState): normalHeroState => {
    console.log("更新NormalHero")

    let [x, y, z] = normalHeroState.position

    //更新position
    let newPosition: [number, number, number] = [x * 2.0, y * 2.0, z * 2.0]

    return {
        ...normalHeroState,
        position: newPosition
    }
}
```

它会更新自己的position。这里只是给出了伪代码，实际的update函数应该会根据层级关系和本地坐标来更新模型矩阵


我们看下SuperHero的update代码：
```ts
export let update = (superHeroState: superHeroState): superHeroState => {
    console.log("更新SuperHero")

    let [x, y, z] = superHeroState.position

    //更新position
    let newPosition: [number, number, number] = [x * 2.0, y * 2.0, z * 2.0]


    return {
        ...superHeroState,
        position: newPosition
    }
}
```

它的逻辑跟NormalHero的update是一样的，这是因为两者都使用同样的算法来更新自己的position


我们回到主循环代码，来看下渲染相关的代码：
ecs_pattern_utils->World
```ts
export let loop = (worldState, [update, renderOneByOne, renderInstances]) => {
    ...
    renderOneByOne(worldState)
    renderInstances(worldState)
    ...
}
```
World
```ts
export let renderOneByOne = (worldState: worldState): void => {
    worldState.superHeros.forEach(superHeroState => {
        console.log("OneByOne渲染 SuperHero...")
    })
}

export let renderInstances = (worldState: worldState): void => {
    let normalHeroStates = worldState.normalHeros

    console.log("批量Instance渲染 NormalHeros...")
}
```

渲染时，首先调用_renderOneByOne函数来一个一个地渲染每个超级英雄；然后调用_renderInstances来一次性渲染所有的普通英雄



## 提出问题

- NormalHero和SuperHero中的update、move函数是重复的逻辑

- 随着功能的增加，NormalHero和SuperHero模块的逻辑也会越来越复杂，不方便维护


# [给出可能的改进方案，分析存在的问题]?


## 概述解决方案？

<!-- 组件化 -->

将人物抽象为GameObject

将人物的行为抽象为组件
<!-- ，并把相关的数据也移到组件中 -->

这样NormalHero、SuperHero都属于GameObject，只是挂载不同的组件




## 给出UML？
TODO tu


现在World由多个GameObject组成

GameObject可以挂载PositionComponent、VelocityComponent、FlyComponent、InstanceComponent这四种组件，每种组件最多挂载一个

<!-- PositionComponent维护position数据，不仅实现了update函数，用来更新自己的position；还实现了move函数，用来实现移动逻辑 -->
将NormalHero、SuperHero的position数据和move函数移到了PositionComponent中

<!-- VelocityComponent维护velocity数据 -->
将NormalHero、SuperHero的velocity数据移到了VelocityComponent中

<!-- FlyComponent维护maxVelocity数据，实现了fly函数，用来实现飞行逻辑 -->
将SuperHero的maxVelocity数据和fly函数移到了FlyComponent中

InstanceComponent跟渲染相关，用来表示挂载该组件的GameObject需要进行一次性批量渲染



## 结合UML图，描述如何具体地解决问题？

- 现在NormalHero、SuperHero都是GameObject了，它本身不实现update、move函数的逻辑，而是通过挂载PositionComponent组件来实现，从而消除了重复逻辑


- 因为NormalHero、SuperHero都是GameObject，而GameObject本身只负责管理组件，没有其它的逻辑。随着功能的增加，GameObject并不会增加逻辑，而是增加对应功能的组件，并让GameObject挂载对应的组件即可


## 给出代码？


Client代码:
```ts
let _createScene = (worldState: worldState): worldState => {
    let normalHero1Data = api.gameObject.create()
    let normalHero1State = normalHero1Data[0]
    let normalHero1 = normalHero1Data[1]

    let positionComponent1 = api.positionComponent.create()
    let velocityComponent1 = api.velocityComponent.create()
    let instanceComponent1 = api.instanceComponent.create()

    normalHero1State = api.gameObject.setPositionComponent(normalHero1State, normalHero1, positionComponent1)
    normalHero1State = api.gameObject.setVelocityComponent(normalHero1State, normalHero1, velocityComponent1)
    normalHero1State = api.gameObject.setInstanceComponent(normalHero1State, normalHero1, instanceComponent1)

    worldState = addGameObject(worldState, [normalHero1State, normalHero1])

    创建和加入normalHero2...

    worldState = api.positionComponent.move(worldState, normalHero1)


    let superHero1Data = api.gameObject.create()
    let superHero1State = superHero1Data[0]
    let superHero1 = superHero1Data[1]

    let positionComponent3 = api.positionComponent.create()
    let velocityComponent3 = api.velocityComponent.create()
    let flyComponent1 = api.flyComponent.create()

    superHero1State = api.gameObject.setPositionComponent(superHero1State, superHero1, positionComponent3)
    superHero1State = api.gameObject.setVelocityComponent(superHero1State, superHero1, velocityComponent3)
    superHero1State = api.gameObject.setFlyComponent(superHero1State, superHero1, flyComponent1)

    worldState = addGameObject(worldState, [superHero1State, superHero1])

    创建和加入superHero2...

    worldState = api.positionComponent.move(worldState, superHero1)
    worldState = api.flyComponent.fly(worldState, superHero1)

    return worldState
}

let worldState = createState()

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState)
```

这里跟之前不一样的地方在于如何创建场景的人物

场景的内容跟之前一样，只是现在创建人物是改为创建一个GameObject和相关的组件，然后挂载组件到GameObject，最后加入该GameObject到World中
并且“移动”、“飞行”也是通过调用对应组件的函数来实现，而不是直接操作人物

普通英雄对应的GameObject挂载了PositionComponent、VelocityComponent、InstanceComponent组件，超级英雄对应的GameObject挂载了PositionComponent、VelocityComponent、FlyComponent组件


现在我们首先来看下World的createState代码：
```ts
export let createState = (): worldState => {
    return {
        gameObjects: Map()
    }
}
```

createState函数创建并返回了WorldState，它现在改为包含保存所有的GameObject的容器



然后我们来看下创建场景相关代码：
World
```ts
export let addGameObject = (worldState: worldState, [gameObjectState, gameObject]): worldState => {
    return {
        ...worldState,
        gameObjects: worldState.gameObjects.set(gameObject, gameObjectState)
    }
}

...

export let api = {
    gameObject: {
        create: createGameObject,
        setPositionComponent,
        setFlyComponent,
        setVelocityComponent,
        setInstanceComponent
    },
    positionComponent: {
        create: createPositionComponent,
        move: (worldState: worldState, gameObject): worldState => {
            return move(worldState, getPositionComponentExn(
                getGameObjectStateExn(worldState, gameObject)
            ))
        }
    },
    velocityComponent: {
        create: createVelocityComponent
    },
    flyComponent: {
        create: createFlyComponent,
        fly: (worldState: worldState, gameObject): worldState => {
            return fly(worldState, getFlyComponentExn(
                getGameObjectStateExn(worldState, gameObject)
            ))
        }
    },
    instanceComponent: {
        create: createInstanceComponent
    }
}
```

gameObject其实就是一个number类型的id值，
gameObjectState保存了一个GameObject的数据

gameObject与gameObjectState一一关联，这个关联体现在前者是WorldState->gameObjects这个Map的Key，后者是Value

World封装了操作GameObject和组件的API

GameObject的相关代码如下：
GameObjectStateType
```ts
type id = number

export type gameObject = id

export type state = {
    positionComponent: positionComponentState | null,
    velocityComponent: velocityComponentState | null
    flyComponent: flyComponentState | null,
    instanceComponent: instanceComponentState | null
}
```
GameObject
```ts
export let create = (): [gameObjectState, gameObject] => {
    let gameObjectState: gameObjectState = {
        positionComponent: null,
        velocityComponent: null,
        flyComponent: null,
        instanceComponent: null
    }

    let id = generateId()

    return [
        gameObjectState,
        id
    ]
}

export let getPositionComponentExn = ({ positionComponent }: gameObjectState): positionComponentState => {
    return getExnFromStrictNull(positionComponent)
}

获得其它组件...

export let setPositionComponent = (gameObjectState: gameObjectState, gameObject: gameObject, positionComponentState): gameObjectState => {
    return {
        ...gameObjectState,
        positionComponent: {
            ...positionComponentState,
            gameObject: gameObject
        }
    }
}

挂载其它组件...

export let hasPositionComponent = ({ positionComponent }: gameObjectState): boolean => {
    return positionComponent !== null
}

has其它组件...
```

gameObjectState中保存了该gameObject挂载的所有组件的state数据


组件的相关代码如下：
PositionComponentStateType
```ts
export type state = {
    gameObject: gameObject | null,
    position: [number, number, number]
}
```
PositionComponent
```ts
export let create = (): positionComponentState => {
    let positionComponentState: positionComponentState = {
        gameObject: null,
        position: [0, 0, 0],
    }

    return positionComponentState
}

export let getPosition = (positionComponentState: positionComponentState) => {
    return positionComponentState.position
}

export let setPosition = (positionComponentState: positionComponentState, position) => {
    return {
        ...positionComponentState,
        position: position
    }
}

...

export let move = (worldState: worldState, positionComponentState: positionComponentState): worldState => {
    let [x, y, z] = positionComponentState.position

    let gameObject = getExnFromStrictNull(positionComponentState.gameObject)

    let velocity = getVelocity(getVelocityComponentExn(getGameObjectStateExn(worldState, gameObject)))

    positionComponentState = setPosition(positionComponentState, [x + velocity, y + velocity, z + velocity])

    return setPositionComponentState(worldState, gameObject, positionComponentState)
}
```
VelocityComponentStateType
```ts
export type state = {
    gameObject: gameObject,
    velocity: number
}
```
VelocityComponent
```ts
export let create = (): velocityComponentState => {
    let velocityComponentState: velocityComponentState = {
        gameObject: null,
        velocity: 1.0
    }

    return velocityComponentState
}

export let getVelocity = (velocityComponentState: velocityComponentState) => {
    return velocityComponentState.velocity
}
```
FlyComponentStateType
```ts
export type state = {
    gameObject: gameObject | null,
    maxVelocity: number
}
```
FlyComponent
```ts
export let create = (): flyComponentState => {
    let flyComponentState: flyComponentState = {
        gameObject: null,
        maxVelocity: 10.0
    }

    return flyComponentState
}

export let getMaxVelocity = (flyComponentState: flyComponentState) => {
    return flyComponentState.maxVelocity
}

export let setMaxVelocity = (flyComponentState: flyComponentState, maxVelocity) => {
    return {
        ...flyComponentState,
        maxVelocity: maxVelocity
    }
}

export let fly = (worldState: worldState, flyComponentState: flyComponentState): worldState => {
    let maxVelocity = flyComponentState.maxVelocity

    let gameObject = getExnFromStrictNull(flyComponentState.gameObject)
    let gameObjectState = getGameObjectStateExn(worldState, gameObject)

    let [x, y, z] = getPosition(getPositionComponentExn(gameObjectState))

    let velocity = getVelocity(getVelocityComponentExn(gameObjectState))

    velocity = velocity < maxVelocity ? (velocity * 2.0) : maxVelocity

    let positionComponentState = setPosition(getPositionComponentExn(gameObjectState), [x + velocity, y + velocity, z + velocity])

    return setPositionComponentState(worldState, gameObject, positionComponentState)
}
```


现在回到Client，继续看创建场景之后的逻辑
Client
```ts
worldState = init(worldState)

loop(worldState, [update, renderOneByOne, renderInstances])
```

这里的步骤跟之前一样，初始化和主循环的逻辑也完全一样

不一样的地方是主循环中的更新、渲染的逻辑不一样

我们看下更新的代码：
World
```ts
export let update = (worldState: worldState): worldState => {
    return {
        ...worldState,
        gameObjects: worldState.gameObjects.map(gameObjectState => {
            if (hasPositionComponent(gameObjectState)) {
                gameObjectState = {
                    ...gameObjectState,
                    positionComponent: updatePositionComponent(getPositionComponentExn(gameObjectState))
                }
            }

            return gameObjectState
        })
    }
}
```

更新update函数会遍历所有的gameObject，调用它挂载的PositionComponent组件的update函数来更新该组件的数据


我们看PositionComponent的update代码：
```ts
export let update = (positionComponentState: positionComponentState): positionComponentState => {
    console.log("更新PositionComponent")

    let [x, y, z] = positionComponentState.position

    //更新position
    let newPosition: [number, number, number] = [x * 2.0, y * 2.0, z * 2.0]

    return {
        ...positionComponentState,
        position: newPosition
    }
}
```

它会更新自己的position


接下来我们看下渲染的代码：
World
```ts
export let renderOneByOne = (worldState: worldState): void => {
    let superHeroGameObjects = worldState.gameObjects.filter(gameObjectState => {
        return !hasInstanceComponent(gameObjectState)
    })

    superHeroGameObjects.forEach(gameObjectState => {
        console.log("OneByOne渲染 SuperHero...")
    })
}

export let renderInstances = (worldState: worldState): void => {
    let normalHeroGameObejcts = worldState.gameObjects.filter(gameObjectState => {
        return hasInstanceComponent(gameObjectState)
    })

    console.log("批量Instance渲染 NormalHeros...")
}
```


现在是判断gameObject是否挂载InstanceComponent组件，如果挂载则进行批量渲染，否则进行一个一个地渲染


## 提出问题


- 如果超级英雄增加一个“跑”的行为，该行为不仅会更新position，还会修改速度velocity，那么该行为对应的run函数应该放在哪个组件中呢？
run函数需要同时修改PositionComponent组件和VelocityComponent组件的数据，因此它放在其中的任何一个组件都不合适。那么就需要增加一种新的组件-RunComponent，来实现run函数。
该函数需要通过RunComponent挂载的gameObject来获得PositionComponent和VelocityComponent组件，然后再修改它们的数据

所以不好处理这种涉及多个组件的操作

- 组件的数据分散在各个组件中，性能不好
如所有人物的position的数据分散保存在各个PositionComponent组件中，那么如果需要遍历所有的position数据时，就会因为CPU中不容易缓存命中而带来性能损失



# [给出使用模式的改进方案]

## 概述解决方案

TODO continue

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
