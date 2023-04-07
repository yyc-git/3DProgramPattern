# [引入故事，提出问题]

## 需求


开发一个游戏，游戏中有两种人物：普通英雄和超级英雄

普通英雄只能移动
超级英雄不仅能够移动，还能飞行

使用Instance来一次性批量渲染所有的普通英雄
一个一个地渲染每个超级英雄


## 给出UML

TODO tu

<!-- World负责游戏世界的管理，它包括了所有的普通英雄和超级英雄数据 -->
World对应游戏世界，由多个普通英雄和多个超级英雄组成
World负责管理所有的英雄，并且实现了初始化和主循环的逻辑

一个NormalHero对应一个普通英雄，具有移动的行为

一个SuperHero对应一个超级英雄， 具有移动、飞行的行为


## 给出代码

Client代码:
```ts
let _createScene = (worldState: worldState): worldState => {
    let normalHero1Data = api.normalHero.create()
    let normalHero1 = normalHero1Data[1]

    worldState = addNormalHero(worldState, normalHero1Data)

    创建和加入normalHero2...


    worldState = api.normalHero.move(worldState, normalHero1)


    let superHero1Data = api.superHero.create()
    let superHero1 = superHero1Data[1]

    worldState = addSuperHero(worldState, superHero1Data)

    创建和加入superHero2...


    worldState = api.superHero.move(worldState, superHero1)
    worldState = api.superHero.fly(worldState, superHero1)


    return worldState
}

let worldState = createState()

worldState = _createScene(worldState)
```

我们首先创建了worldState，用来保存所有的数据；
然后创建了场景，包括两个普通英雄和两个超级英雄，其中第一个普通英雄进行了移动，第一个超级英雄进行了移动和飞行


我们首先来看下World的createState代码：
```ts
export let createState = (): worldState => {
    return {
        normalHeros: Map(),
        superHeros: Map()
    }
}
```

createState函数创建并返回了worldState，它包括两个分别用来保存所有的normalHero和所有的superHero的容器-Hash Map



然后我们来看下创建场景相关的部分代码：
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

我们将一个英雄的数据保存在一个state中，然后用一个索引与其关联。具体就是：
normalHero、superHero其实就是一个number类型的id值
normalHeroState、superHeroState分别保存了一个普通英雄、一个超级英雄的数据（比如position、velocity）
normalHero与normalHeroState一一关联，这个关联体现在前者是worldState->normalHeros这个Hash Map的Key，后者是它的Value
同理，superHero与superHeroState关联

World封装了操作Hero的API

我们继续看创建场景相关的剩余代码：
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

superHero的move的逻辑跟normalHero的move的逻辑一样

fly函数实现了飞行的逻辑，它跟move函数一样，也是更新了superHero的position。只是因为两者在计算时使用的速度不一样，所以更新的幅度不同



现在回到Client，继续看创建场景之后的逻辑
Client
```ts
worldState = init(worldState)

loop(worldState, [update, renderOneByOne, renderInstances])
```

这里进行了初始化；
然后开始了主循环

这里的初始化init函数中没有任何逻辑，只是进行了打印，所以跳过不看它的代码


我们来看下主循环相关代码：
ecs_pattern_utils->World
```ts
export let loop = (worldState, [update, renderOneByOne, renderInstances]) => {
    worldState = update(worldState)
    ...

    requestAnimationFrame(
        (time) => {
            loop(worldState, [update, renderOneByOne, renderInstances])
        }
    )
}
```

在每次主循环中，进行了更新

我们看下更新的相关代码：
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

它更新了自己的position
这里只是给出了伪代码用于演示而已，实际的update函数应该会根据该普通英雄的层级关系和本地坐标来更新他的模型矩阵


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


我们回到主循环代码，来看下更新之后的渲染相关的代码：
ecs_pattern_utils->World
```ts
export let loop = (worldState, [update, renderOneByOne, renderInstances]) => {
    worldState = update(worldState)
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

渲染时，首先通过renderOneByOne函数来一个一个地渲染每个超级英雄；然后通过renderInstances函数来一次性批量渲染所有的普通英雄




下面，我们运行代码，运行结果如下：
```text
初始化...
更新NormalHero
更新NormalHero
更新SuperHero
更新SuperHero
OneByOne渲染 SuperHero...
OneByOne渲染 SuperHero...
批量Instance渲染 NormalHeros...
{"normalHeros":{"144891":{"position":[0,0,0],"velocity":1},"648575":{"position":[2,2,2],"velocity":1}},"superHeros":{"497069":{"position":[6,6,6],"velocity":1,"maxFlyVelocity":10},"783438":{"position":[0,0,0],"velocity":1,"maxFlyVelocity":10}}}
```

首先进行了初始化；
然后更新了所有的人物，包括两个普通英雄和两个超级英雄；
然后依次渲染了2个超级英雄，以及一次性批量渲染了所有的普通英雄；
最后打印了worldState

我们看到normalHeros中有一个的position为[2,2,2]，说明该普通英雄进行了move操作；superHeros中有一个的position为[6,6,6]，说明该超级英雄进行了move和fly操作
normalHeros和superHeros中的Key因为是随机生成的id值，所以每次打印时值都不一样




## 提出问题

- NormalHero和SuperHero中的update、move函数的逻辑是重复的

- 如果增加更多的行为，NormalHero和SuperHero模块的逻辑会越来越复杂，不容易维护。这可以通过继承来解决，即最上面是Hero基类，然后不同种类的Hero层层继承。但是继承的方式很死板，不够灵活


# [给出可能的改进方案，分析存在的问题]?


## 概述解决方案？

使用组件化的思想，用组合代替继承，进行下面的改进：
将人物抽象为GameObject
将人物的行为抽象为组件
<!-- ，并把相关的数据也移到组件中 -->
这样NormalHero、SuperHero都是GameObject，只是挂载不同的组件而已




## 给出UML？
TODO tu


World由多个GameObject组成
World负责管理所有的gameObject，并且实现了初始化和主循环的逻辑

GameObject负责管理挂载的组件，它可以挂载PositionComponent、VelocityComponent、FlyComponent、InstanceComponent这四种组件，每种组件最多挂载一个

组件负责维护自己的数据，实现自己的逻辑。
具体来说，将NormalHero、SuperHero的position数据和move函数移到了PositionComponent中；
将NormalHero、SuperHero的velocity数据移到了VelocityComponent中；
将SuperHero的maxVelocity数据和fly函数移到了FlyComponent中；
InstanceComponent没有数据和逻辑，它只是一个标记，用来表示挂载该组件的GameObject需要进行一次性批量渲染



## 结合UML图，描述如何具体地解决问题？

- 现在NormalHero、SuperHero都是GameObject了，它本身没有行为的逻辑，而是通过挂载PositionComponent组件来实现，从而消除了两种人物都实现相同的update、move函数造成的重复逻辑


- 因为NormalHero、SuperHero都是GameObject，而GameObject本身只负责管理组件，没有其它的逻辑。随着行为的增加，GameObject并不会增加逻辑，而是增加对应行为的组件，GameObject只需挂载对应的组件即可
通过这样的设计，就将行为的逻辑和数据分散在对应的组件中，通过组合的方式使人物具有多个行为，从而避免了庞大的人物模块的出现


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
```

这里跟之前不一样的地方在于如何创建场景的人物

这里创建的场景跟之前一样，都包括了2个普通英雄和2个超级英雄
只是现在创建人物的方式是改为：
首先创建一个GameObject和相关的组件；
然后挂载组件到GameObject；
最后加入该GameObject到World中


普通英雄对应的GameObject挂载了PositionComponent、VelocityComponent、InstanceComponent组件
超级英雄对应的GameObject挂载了PositionComponent、VelocityComponent、FlyComponent组件


让人物进行“移动”、“飞行”的行为改为通过调用对应组件的函数而不是直接操作人物来实现



现在我们首先来看下World的createState代码：
```ts
export let createState = (): worldState => {
    return {
        gameObjects: Map()
    }
}
```

createState函数创建并返回了worldState，它现在是包括所有的GameObject的容器Hash Map



然后我们来看下创建场景相关的部分代码：
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

这里与之前一样，我们将一个GameObject的数据保存在一个state中，然后用一个索引与其关联。具体就是：
gameObject其实就是一个number类型的id值，
gameObjectState保存了一个GameObject的数据
gameObject与gameObjectState一一关联，这个关联体现在前者是worldState->gameObjects这个Hash Map的Key，后者是它的Value

World封装了操作GameObject和组件的API

我们继续看创建场景相关的剩余代码：
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
gameObjectState中保存了该gameObject挂载的所有组件的state数据

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

GameObject负责创建gameObject和管理挂载的组件


组件与GameObject一样，我们将它的数据保存在一个state中，只是不需要索引。所以一个组件就等于一个组件state


组件的相关代码如下：
PositionComponentStateType
```ts
export type state = {
    gameObject: gameObject | null,
    position: [number, number, number]
}
```

组件state中保存了挂载到的gameObject，这样可以通过gameObject来获得挂载到gameObject的其它组件，从而获得其它组件的数据

PositionComponent
```ts
export let create = (): positionComponentState => {
    let positionComponentState: positionComponentState = {
        gameObject: null,
        position: [0, 0, 0],
    }

    //直接返回组件state，无需索引
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

    //通过gameObject获得velocityComponent，获得它的velocity
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

    //通过gameObject获得positionComponent，获得它的position
    let [x, y, z] = getPosition(getPositionComponentExn(gameObjectState))

    //通过gameObject获得velocityComponent，获得它的velocity
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

更新update函数会遍历所有的gameObject，调用它挂载的PositionComponent组件的update函数来更新该组件


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

它的逻辑跟之前的update函数的逻辑一样


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


这里判断gameObject是否挂载了InstanceComponent组件，如果挂载则进行批量渲染，否则进行一个一个地渲染


下面，我们运行代码，运行结果如下：
```text
初始化...
更新PositionComponent
更新PositionComponent
更新PositionComponent
更新PositionComponent
OneByOne渲染 SuperHero...
OneByOne渲染 SuperHero...
批量Instance渲染 NormalHeros...
{"gameObjects":{"304480":{"positionComponent":{"gameObject":304480,"position":[0,0,0]},"velocityComponent":{"gameObject":304480,"velocity":1},"flyComponent":{"gameObject":304480,"maxVelocity":10},"instanceComponent":null},"666533":{"positionComponent":{"gameObject":666533,"position":[2,2,2]},"velocityComponent":{"gameObject":666533,"velocity":1},"flyComponent":null,"instanceComponent":{"gameObject":666533}},"838392":{"positionComponent":{"gameObject":838392,"position":[0,0,0]},"velocityComponent":{"gameObject":838392,"velocity":1},"flyComponent":null,"instanceComponent":{"gameObject":838392}},"936933":{"positionComponent":{"gameObject":936933,"position":[6,6,6]},"velocityComponent":{"gameObject":936933,"velocity":1},"flyComponent":{"gameObject":936933,"maxVelocity":10},"instanceComponent":null}}}
```

运行结果的步骤与之前一样
不同之处在于：
更新人物变为更新positionComponent；
打印的worldState不一样


我们看下打印的worldState：
gameObjects包括了4个gameObject的数据；
有一个gameObject的positionComponent的position为[2,2,2]，说明该gameObject进行了move操作；
有一个gameObject的positionComponent的position为[6,6,6]，说明该gameObject进行了move和fly操作
gameObjects中的Key因为是随机生成的id值，所以每次打印时值都不一样

## 提出问题

- 组件的数据分散在各个组件中，性能不好
现在所有人物的position的数据一对一地分散保存在各个PositionComponent组件中，那么在遍历所有的position数据时，会因为CPU中不容易缓存命中而带来性能损失


- 如果超级英雄增加一个“跑”的行为，该行为不仅会更新position，还会修改速度velocity，那么该行为对应的run函数应该放在哪个组件中呢？
因为run函数需要同时修改PositionComponent组件和VelocityComponent组件的数据，所以它放在其中的任何一种组件都不合适，需要增加一种新的组件-RunComponent，对应“跑”的行为，实现run函数
该函数需要通过RunComponent挂载的gameObject来获得PositionComponent和VelocityComponent组件，然后再修改它们的数据

如果有更多的涉及多种组件的行为，就需要为每个行为增加一种组件。
因为组件比较重，既有数据又有逻辑，所以增加的开发成本较高
另外，组件与GameObject是聚合关系，而GameObject和World也是聚合关系，它们都属于强关联关系，所以增加组件会较强地影响GameObject和World模块，也增加了成本



# [给出使用模式的改进方案]

## 概述解决方案

使用Data Oriented的思想进行改进：
将所有的gameObject、每种组件的数据集中起来，保存在各自的连续空间中
其中，gameObject与挂载的组件的对应关系则保存在Hash Map中；
将组件的角色分为Data Oriented组件（每个组件都有数据，且组件的数量较多）和其它组件（每个组件都没有数据，或者组件的数量很少）。这里具体说明一下：
目前一共有四种组件，它们为：PositionComponent、VelocityComponent、FlyComponent、InstanceComponent。其中Instance组件因为没有组件数据，所以属于“其它组件”的角色；而另外三种组件则都属于“Data Oriented组件”的角色；
Data Oriented组件的数据保存在各自的ArrayBuffer中；
将GameObject和各个Component扁平化，使得GameObject是一个number类型的id值，Component是一个number类型的索引。其中GameObject是gameObject与挂载的组件的对应关系这个Hash Map的Key；Component既是这个Hash Map的Value，又是ArrayBuffer中的索引


我们增加Manager这一层，来维护和管理GameObject和组件的数据
其中GameObjectManager负责维护所有的gameObject的数据；
四种组件的Manager负责维护自己的ArrayBuffer，操作属于该种类的所有组件

值得注意的是将保存gameObject与挂载的组件的对应关系的Hash Map放在哪里？
它们可以放在GameObjectManager中，也可以分散放在组件的Manager中。
考虑到为了方便组件直接就近获得自己挂载到的GameObject，所以我们选择将其分散放在组件的Manager中


我们增加System这一层，来实现行为的逻辑。
一个System对应一个行为，比如我们加入MoveSystem、FlySystem来分别实现移动、飞行的行为逻辑


值得注意的是一种组件的Manager只对该种组件进行操作，而System可以对多种组件进行操作

## 给出UML？

TODO tu



整个UML主要分成三个层级：System、Manager、Component+GameObject，它们的依赖关系为System依赖Manager，Manager依赖Component+GameObject

World不再管理所有的gameObject，但是仍然实现了初始化和主循环的逻辑


我们看下System这一层：
有多个System，每个System实现一个行为逻辑
其中，CreateStateSystem实现创建worldState的逻辑，worldState包括了所有的Manager的state；
UpdateSystem实现更新所有人物的position的逻辑，具体是更新所有PositionComponent的position；
MoveSystem实现一个人物的移动，具体是使用了挂载到该人物对应的 gameObject上的一个positionComponent和一个velocityComponent，更新了该positionComponent的position；
FlySystem实现一个人物的飞行，具体是使用了挂载到该人物对应的gameObject上的一个positionComponent、一个velocityComponent、一个flyComponent，更新了该positionComponent的position；
RenderOneByOneSystem实现渲染所有超级英雄的逻辑；
RenderInstancesSystem实现渲染所有普通英雄的逻辑


我们看下Manager这一层：

GameObjectManager负责管理所有的gameObject

PositionComponentManager、VelocityComponentManager、FlyComponentManager、InstanceComponentManager负责管理属于各自种类的所有的组件


PositionComponentManager的batchUpdate函数负责批量更新所有的positionComponent的position

PositionComponentManager维护了gameObjectMap、gameObjectPositionMap这两个Hash Map，前者为positionComponent与gameObject的对应关系，后者为gameObject与positionComponent的对应关系


因为VelocityComponentManager、FlyComponentManager与PositionComponentManager类似（只是没有batchUpdate函数），故在图中省略它们的数据和函数



我们看下Component+GameObject这一层：
因为PositionComponent、VelocityComponent、FlyComponent属于Data Oriented组件，所以它们的值是一个index，也就是各自ArrayBuffer中的索引；
而因为InstanceComponent属于其它组件，所以它的值是一个id。它是InstanceComponentManager维护的gameObjectMap的Key和gameObjectInstanceMap的Value


## 结合UML图，描述如何具体地解决问题？

- 现在组件的数据都集中保存在各自的Manager的ArrayBuffer中，从而在遍历同一种组件的所有组件的数据时增加了缓存命中，提高了性能

- 涉及多种组件的行为放在对应的System中。因为System很轻，没有数据，只有逻辑，所以增加和维护System的成本较低；另外，修改System也不会影响它的下一层-Manager层




## 给出代码？

Client代码:
```ts
let worldState = createState({ positionComponentCount: 10, velocityComponentCount: 10, flyComponentCount: 10 })
```

这里通过调用CreateStateSystem的createState函数来创建worldState

现在我们来看下CreateStateSystem的createState代码：
```ts
export let createState = ({ positionComponentCount, velocityComponentCount, flyComponentCount }): worldState => {
    return {
        gameObjectManagerState: GameObjectManager.createState(),
        positionComponentManagerState: PositionComponentManager.createState(positionComponentCount),
        velocityComponentManagerState: VelocityComponentManager.createState(velocityComponentCount),
        flyComponentManagerState: FlyComponentManager.createState(flyComponentCount),
        instanceComponentManagerState: InstanceComponentManager.createState()
    }
}
```

createState函数创建的worldState包括了各个Manager的state

因为Data Oriented组件的state在创建时要创建包括该种组件的所有组件数据的ArrayBuffer，所以需要知道组件的最大个数，因此这里的createState函数接收了三种Data Oriented组件的最大个数

我们来看下创建ArrayBuffer的相关代码：
我们以PositionComponent组件为例，首先看下PositionComponentManager的createState相关代码：
position_component/ManagerStateType
```ts
export type state = {
    maxIndex: number,
    buffer: ArrayBuffer,
    positions: Float32Array,
    gameObjectMap: Map<component, gameObject>,
    gameObjectPositionMap: Map<gameObject, component>,
}
```

这是PositionComponentManager的state的类型定义

buffer字段保存了一个ArrayBuffer，用来保存所有的positionComponent的数据
positions字段保存了ArrayBuffer的一个视图，通过它可以读写所有的positionComponent的position的数据

position_component/Manager
```ts
let _setAllTypeArrDataToDefault = ([positions]: Array<Float32Array>, count, [defaultPosition]) => {
    range(0, count - 1).forEach(index => {
        OperateTypeArrayUtils.setPosition(index, defaultPosition, positions)
    })

    return [positions]
}

let _initBufferData = (count, defaultDataTuple): [ArrayBuffer, Array<Float32Array>] => {
    let buffer = createBuffer(count)

    let typeArrData = _setAllTypeArrDataToDefault(createTypeArrays(buffer, count), count, defaultDataTuple)

    return [buffer, typeArrData]
}

export let createState = (positionComponentCount: number): state => {
    let defaultPosition = [0, 0, 0]

    let [buffer, [positions]] = _initBufferData(positionComponentCount, [defaultPosition])

    return {
        maxIndex: 0,
        buffer,
        positions,
        gameObjectMap: Map(),
        gameObjectPositionMap: Map(),
    }
}
```
在createState函数调用的_initBufferData函数中，首先创建了包括最大组件个数数据的ArrayBuffer；
然后创建了所有的TypeArray，它是操作ArrayBuffer的视图。这里具体就是创建了一个视图：positions；
最后将positions的所有的值写为默认值

下面是创建ArrayBuffer和视图相关代码：
position_componnet/BufferUtils
```ts
let _getPositionSize = () => 3

export let getPositionOffset = (count) => 0

export let getPositionLength = (count) => count * _getPositionSize()

export let getPositionIndex = index => index * _getPositionSize()

let _getTotalByteLength = (count) => {
    return count * Float32Array.BYTES_PER_ELEMENT * _getPositionSize()
}

export let createBuffer = (count) => {
    return new ArrayBuffer(_getTotalByteLength(count))
}
```
position_componnet/CreateTypeArrayUtils
```ts
export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, getPositionOffset(count), getPositionLength(count))
    ]
}
```

另外两种Data Oriented组件的Manager（VelocityComponentManager、FlyComponentManager）的createState函数的逻辑跟PositionComponentManager的createState函数的逻辑一样


<!-- 我们来看下属于其它组件的InstanceComponentManager的createState的相关代码：
instance_component/ManagerStateType
```ts
export type state = {
    maxUID: number,
    gameObjectMap: Map<component, gameObject>,
    gameObjectInstanceMap: Map<gameObject, component>,
}
```
instance_component/Manager
```ts
export let createState = (): state => {
    return {
        maxUID: 0,
        gameObjectMap: Map(),
        gameObjectInstanceMap: Map(),
    }
}
```

这里代码很简单，没有创建ArrayBuffer的代码 -->


我们继续来看下Client的代码：
```ts
let _createScene = (worldState: worldState): worldState => {
    let normalHero1Data = createGameObject(worldState)
    worldState = normalHero1Data[0]
    let normalHero1 = normalHero1Data[1]

    let positionComponent1Data = createPositionComponent(worldState)
    worldState = positionComponent1Data[0]
    let positionComponent1 = positionComponent1Data[1]
    let velocityComponent1Data = createVelocityComponent(worldState)
    let velocityComponent1 = velocityComponent1Data[1]
    worldState = velocityComponent1Data[0]
    let instanceComponent1Data = createInstanceComponent(worldState)
    let instanceComponent1 = instanceComponent1Data[1]
    worldState = instanceComponent1Data[0]

    worldState = setPositionComponent(worldState, normalHero1, positionComponent1)
    worldState = setVelocityComponent(worldState, normalHero1, velocityComponent1)
    worldState = setInstanceComponent(worldState, normalHero1, instanceComponent1)


    创建和加入normalHero2...

    worldState = move(worldState, positionComponent1, velocityComponent1)


    let superHero1Data = createGameObject(worldState)
    worldState = superHero1Data[0]
    let superHero1 = superHero1Data[1]

    let positionComponent3Data = createPositionComponent(worldState)
    worldState = positionComponent3Data[0]
    let positionComponent3 = positionComponent3Data[1]
    let velocityComponent3Data = createVelocityComponent(worldState)
    let velocityComponent3 = velocityComponent3Data[1]
    worldState = velocityComponent3Data[0]
    let flyComponent1Data = createFlyComponent(worldState)
    let flyComponent1 = flyComponent1Data[1]
    worldState = flyComponent1Data[0]

    worldState = setPositionComponent(worldState, superHero1, positionComponent3)
    worldState = setVelocityComponent(worldState, superHero1, velocityComponent3)
    worldState = setFlyComponent(worldState, superHero1, flyComponent1)

    创建和加入superHero2...

    worldState = move(worldState, positionComponent3, velocityComponent3)

    worldState = fly(worldState, positionComponent3, velocityComponent3, flyComponent1)


    return worldState
}

...

worldState = _createScene(worldState)
```

创建state之后，就创建了场景

这里创建的场景跟之前一样
创建的方式也跟之前类似，不同之处主要在于：
不需要加入GameObject到World中；
“移动”、“飞行”的行为现在是通过调用MoveSystem和FlySystem的函数操作对应的组件来实现；
让人物进行“移动”、“飞行”的行为改为通过调用MoveSystem和FlySystem的函数操作对应的组件来实现


我们来看下创建场景中除了“move”、“fly”以外的相关代码：
SceneAPI
```ts
export let createGameObject = (worldState: worldState): [worldState, gameObject] => {
    let [gameObjectManagerState, gameObject] = GameObjectManager.createGameObject(worldState.gameObjectManagerState)

    return [
        {
            ...worldState,
            gameObjectManagerState
        },
        gameObject
    ]
}

export let createPositionComponent = (worldState: worldState): [worldState, component] => {
    let [positionComponentManagerState, component] = PositionComponentManager.createComponent(worldState.positionComponentManagerState)

    return [
        {
            ...worldState,
            positionComponentManagerState
        },
        component
    ]
}

创建其它组件...

export let setPositionComponent = (worldState: worldState, gameObject: gameObject, component: component): worldState => {
    return {
        ...worldState,
        positionComponentManagerState: PositionComponentManager.setComponent(worldState.positionComponentManagerState, gameObject, component)
    }
}

挂载其它组件...
```

SceneAPI封装了创建场景的API


GameObjectManager的相关代码如下：
gameObject/ManagerState
```ts
export type state = {
    maxUID: number
}
```
gameObject/Manager
```ts
export let createState = (): state => {
    return {
        maxUID: 0
    }
}

export let createGameObject = (state: state): [state, gameObject] => {
    let uid = state.maxUID

    let newUID = uid + 1

    state = {
        ...state,
        maxUID: newUID
    }

    return [state, uid]
}
```
PositionComponentManager的相关代码如下：
```ts
export let createComponent = (state: state): [state, component] => {
    let index = state.maxIndex

    let newIndex = index + 1

    state = {
        ...state,
        maxIndex: newIndex
    }

    return [state, index]
}

export let getComponentExn = (state: state, gameObject: gameObject): component => {
    let { gameObjectMap } = state

    return getExnFromStrictNull(gameObjectMap.get(gameObject))
}

export let setComponent = (state: state, gameObject: gameObject, component: component): state => {
    let { gameObjectMap, gameObjectPositionMap } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectPositionMap: gameObjectPositionMap.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectPositionMap } = state

    return gameObjectPositionMap.has(gameObject)
}
```

VelocityComponentManager、FlyComponentManager相关代码跟PositionComponentManager类似

InstanceComponentManager相关代码也跟PositionComponentManager类似，除了createComponent函数稍微有点不同
createComponent的代码为：
instance_component/Manager
```ts
export let createComponent = (state: state): [state, component] => {
    let uid = state.maxUID

    let newUID = uid + 1

    state = {
        ...state,
        maxUID: newUID
    }

    return [state, uid]
}
```


我们来看下创建场景中与“move”、“fly”相关的代码：
MoveSystem
```ts
export let move = (worldState: worldState, positionComponent, velocityComponent): worldState => {
    let [x, y, z] = getPosition(worldState.positionComponentManagerState, positionComponent)

    let velocity = getVelocity(worldState.velocityComponentManagerState, velocityComponent)

    let positionComponentManagerState = setPosition(worldState.positionComponentManagerState, positionComponent, [x + velocity, y + velocity, z + velocity])

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }
}
```
FlySystem
```ts
export let fly = (worldState: worldState, positionComponent, velocityComponent, flyComponent): worldState => {
    let [x, y, z] = getPosition(worldState.positionComponentManagerState, positionComponent)

    let velocity = getVelocity(worldState.velocityComponentManagerState, velocityComponent)

    let maxVelocity = getMaxVelocity(worldState.flyComponentManagerState, flyComponent)

    velocity = velocity < maxVelocity ? (velocity * 2.0) : maxVelocity

    let positionComponentManagerState = setPosition(worldState.positionComponentManagerState, positionComponent, [x + velocity, y + velocity, z + velocity])

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }
}
```

这里涉及到读写Data Oriented组件的ArrayBuffer上的数据，我们来看下读写PositionComponentManager的positions数据的相关代码：
position_component/Manager
```ts
export let getPosition = (state: state, component: component) => {
    return OperateTypeArrayUtils.getPosition(component, state.positions)
}

export let setPosition = (state: state, component: component, position) => {
    OperateTypeArrayUtils.setPosition(component, position, state.positions)

    return state
}
```
position_component/OperateTypeArrayUtils
```ts
export let getPosition = (index, typeArr) => {
    return getFloat3Tuple(getPositionIndex(index), typeArr)
}

export let setPosition = (index, data, typeArr) => {
    setFloat3(getPositionIndex(index), data, typeArr)
}
```
TypeArrayUtils
```ts
export let getFloat3Tuple = (index, typeArray) => {
    return [
        typeArray[index],
        typeArray[index + 1],
        typeArray[index + 2]
    ]
}

export let setFloat3 = (index, param, typeArray) => {
    typeArray[index] = param[0]
    typeArray[index + 1] = param[1]
    typeArray[index + 2] = param[2]
}
```

这里的实现思路是因为positionComponent的值为索引，所以使用它来读写positions中的对应数据



现在回到Client，继续看创建场景之后的逻辑
Client
```ts
worldState = init(worldState)

loop(worldState, [UpdateSystem.update, RenderOneByOneSystem.render, RenderInstancesSystem.render])
```

这里的步骤跟之前一样，初始化和主循环的逻辑也完全一样

不一样的地方是主循环中的更新、渲染的逻辑是通过调用对应的System实现的


我们看下更新的代码：
UpdateSystem
```ts
export let update = (worldState: worldState): worldState => {
    let positionComponentManagerState = batchUpdate(worldState.positionComponentManagerState)

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }
}
```
position_component/Manager
```ts
export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectPositionMap } = state

    return gameObjectPositionMap.toArray().map(([key, value]) => value)
}

export let batchUpdate = (state: state) => {
    return getAllComponents(state).reduce((state, component) => {
        console.log("更新PositionComponent: " + String(component))

        let [x, y, z] = getPosition(state, component)

        //更新position
        let newPosition: [number, number, number] = [x * 2.0, y * 2.0, z * 2.0]

        return setPosition(state, component, newPosition)
    }, state)
}
```


UpdateSystem的update函数调用了PositionComponentManager的batchUpdate函数来批量更新



接下来我们看下渲染的代码：
RenderOneByOneSystem
```ts
export let render = (worldState: worldState): void => {
    let superHeroGameObjects = getAllGameObjects(worldState.gameObjectManagerState).filter(gameObject => {
        //hasInstanceComponent是InstanceComponentManager的hasComponent函数
        return !hasInstanceComponent(worldState.instanceComponentManagerState, gameObject)
    })

    superHeroGameObjects.forEach(gameObjectState => {
        console.log("OneByOne渲染 SuperHero...")
    })
}
```
gameObject/Manager
```ts
export let getAllGameObjects = (state: state): Array<gameObject> => {
    let { maxUID } = state

    return range(0, maxUID - 1)
}
```

RenderOneByOneSystem通过GameObjectManager获得所有的gameObject；然后过滤它们，获得所有的没有挂载InstanceComponent组件的gameObject，它们就是所有的超级英雄；最后一个一个地渲染

RenderInstancesSystem
```ts
export let render = (worldState: worldState): void => {
    let normalHeroGameObejcts = getAllGameObjects(worldState.gameObjectManagerState).filter(gameObject => {
        return hasInstanceComponent(worldState.instanceComponentManagerState, gameObject)
    })

    console.log("批量Instance渲染 NormalHeros...")
}
```

RenderInstancesSystem则是获得所有挂载InstanceComponent组件的gameObject，它们就是所有的普通英雄；最后一次性批量渲染




下面，我们运行代码，运行结果如下：
```text
初始化...
更新PositionComponent: 0
更新PositionComponent: 1
更新PositionComponent: 2
更新PositionComponent: 3
OneByOne渲染 SuperHero...
OneByOne渲染 SuperHero...
批量Instance渲染 NormalHeros...
{"gameObjectManagerState":{"maxUID":4},"positionComponentManagerState":{"maxIndex":4,"buffer":{},"positions":{"0":2,"1":2,"2":2,"3":0,"4":0,"5":0,"6":6,"7":6,"8":6,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0},"gameObjectMap":{"0":0,"1":1,"2":2,"3":3},"gameObjectPositionMap":{"0":0,"1":1,"2":2,"3":3}},"velocityComponentManagerState":{"maxIndex":4,"buffer":{},"velocitys":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1},"gameObjectMap":{"0":0,"1":1,"2":2,"3":3},"gameObjectVelocityMap":{"0":0,"1":1,"2":2,"3":3}},"flyComponentManagerState":{"maxIndex":1,"buffer":{},"maxVelocitys":{"0":10,"1":10,"2":10,"3":10,"4":10,"5":10,"6":10,"7":10,"8":10,"9":10},"gameObjectMap":{"0":2,"1":3},"gameObjectFlyMap":{"2":0,"3":1}},"instanceComponentManagerState":{"maxUID":1,"gameObjectMap":{"0":0,"1":1},"gameObjectInstanceMap":{"0":0,"1":1}}}
```

运行结果的步骤与之前一样
不同之处在于：
打印的worldState不一样


我们看下打印的worldState：
gameObjectManagetState的maxUID为4，说明创建了4个gameObject；
positionComponentManagerState的maxIndex为4，说明创建了4个positionComponent；
positionComponentManagerState的positions有3个连续的值是2、2、2，说明进行了一次move操作；有另外3个连续的值是6、6、6，说明进行了一次move操作和一次fly操作；


<!-- # 设计意图

阐明模式的设计目标 -->

# 定义

## 一句话定义？

组合代替继承，集中管理组件数据，分离逻辑和数据



## 补充说明

“组合代替继承”是指组件化思想
“集中管理组件数据”是指Data Oriented思想
“分离逻辑和数据”是指提出System、Manager、Component+GameObject三层，其中System实现行为逻辑，Manager维护数据，组件和GameObject只是一个number类型的索引或者id值


<!-- 一个System实现一个行为的逻辑 -->

<!-- GameObjectManager维护和管理所有的gameObject的数据； -->
<!-- GameObjectManager负责管理所有的gameObject -->
各种组件的Manager维护和管理该种类所有的组件数据，将其集中连续地保存在ArrayBuffer中

<!-- GameObject、组件就只是一个索引 -->

## 通用UML？
TODO tu

## 分析角色？

我们来看看模式的相关角色：

整个UML主要分成三个层级：System、Manager、Component+GameObject，它们的依赖关系为System依赖Manager，Manager依赖Component+GameObject

System层负责实现行为的逻辑
Manager层负责管理场景数据，即GameObject和组件的数据
Component+GameObject层为组件和GameObject，它们现在只是有一个number类型的数据的值对象


下面的角色属于System层：

- CreateStateSystem
该角色负责创建worldState

- OtherSystem
该角色代表除了CreateStateSystem以外的System


下面的角色属于Manager层：

- GameObjectManager
该角色维护和管理所有的gameObject的数据

- DataOrientedComponentManager
该角色是一种Data Oriented组件的Manager，负责维护和管理该种组件的所有组件数据，将其集中连续地保存在ArrayBuffer中

- OtherComponentManager
该角色是一种其它组件的Manager，负责维护和管理该种组件的所有组件数据


下面的角色属于Component+GameObject层：

- DataOrientedComponent
该角色是属于一种Data Oriented组件，该种组件的每个组件都只是一个ArrayBuffer中的索引

- OtherComponent
该角色是属于一种其它组件，该种组件的每个组件都只是一个id

- GameObject
该角色是一个gameObject，它本身只是一个id




## 角色之间的关系？

- 只有一个CreateStateSystem

- OtherSystem可以有多个，每个System负责处理一个行为

- 只有一个GameObjectManager

- DataOrientedComponentManager可以有多个，每个Manager对应一种Data Oriented组件，所以在图中DataOrientedComponentManager与DataOrientedComponent是一对一的依赖关系

- OtherComponentManager可以有多个，每个Manager对应一种其它组件，所以在图中OtherComponentManager与OtherComponent是一对一的依赖关系

- 一个gameObject可以挂载多种组件，所以在图中GameObject与DataOrientedComponent、OtherComponent都是一对多的组合关系


## 角色的抽象代码？

下面我们来看看各个角色的抽象代码：

- Client的抽象代码
```ts
let _createScene = (worldState: worldState): worldState => {
    let gameObject1Data = createGameObject(worldState)
    worldState = gameObject1Data[0]
    let gameObject1 = gameObject1Data[1]

    let dataOrientedComponent1Data = createDataOrientedComponent1(worldState)
    worldState = dataOrientedComponent1Data[0]
    let dataOrientedComponent1 = dataOrientedComponent1Data[1]
    let otherComponent1Data = createOtherComponent1(worldState)
    let otherComponent1 = otherComponent1Data[1]
    worldState = otherComponent1Data[0]

    worldState = setDataOrientedComponent1(worldState, gameObject1, dataOrientedComponent1)
    worldState = setOtherComponent1(worldState, gameObject1, otherComponent1)

    worldState = action1(worldState, gameObject1, dataOrientedComponent1, otherComponent1)


    创建更多的GameObjects...


    return worldState
}

let worldState = createState({ dataOrientedComponent1Count: xx })

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState)
```

- World的抽象代码
```ts
export let createState = CreateStateSystem.createState

export let action1 = OtherSystem1.action

export let init = (worldState: worldState): worldState => {
    console.log("初始化...")

    return worldState
}


//假实现
let requestAnimationFrame = (func) => {
}


export let loop = (worldState: worldState) => {
    调用System来update

    调用System来render

    requestAnimationFrame(
        (time) => {
            loop(worldState)
        }
    )
}
```

- CreateStateSystem的抽象代码
```ts
export let createState = ({ dataOrientedComponent1Count }): worldState => {
    return {
        gameObjectManagerState: GameObjectManager.createState(),
        dataOrientedComponent1ManagerState: DataOrientedComponent1Manager.createState(dataOrientedComponent1Count),
        otherComponent1ManagerState: OtherComponent1Manager.createState(),

        更多的DataOrientedManagerState和OtherComponentManagerState...
    }
}
```

- OtherSystem的抽象代码
```ts
export let action = (worldState: worldState, gameObject?: gameObject, dataOrientedComponentX?: dataOrientedComponentX, otherComponentX?: otherComponentX) => {
    console.log("行为的逻辑...")

    return worldState
}
```

- GameObjectManager的抽象代码
gameObject/ManagerStateType
```ts
export type state = {
    maxUID: number
}
```
gameObject/Mmanager
```ts
export let createState = (): state => {
    return {
        maxUID: 0
    }
}

export let createGameObject = (state: state): [state, gameObject] => {
    let uid = state.maxUID

    let newUID = uid + 1

    state = {
        ...state,
        maxUID: newUID
    }

    return [state, uid]
}

export let getAllGameObjects = (state: state): Array<gameObject> => {
    let { maxUID } = state

    return range(0, maxUID - 1)
}
```

- DataOrientedComponentManager的抽象代码
dataoriented_component1/ManagerStateType
```ts
export type TypeArrayType = Float32Array | Uint8Array | Uint16Array | Uint32Array

export type state = {
    maxIndex: number,
    buffer: ArrayBuffer,
    value1s: TypeArrayType,
    value2s: TypeArrayType,
    更多valueXs...,

    gameObjectMap: Map<component, gameObject>,
    gameObjectDataOrientedComponent1Map: Map<gameObject, component>,
}
```
dataoriented_component1/Manager
```ts
let _setAllTypeArrDataToDefault = ([value1s, value2s]: Array<Float32Array>, count, [defaultValue1, defaultValue2]) => {
    range(0, count - 1).forEach(index => {
        OperateTypeArrayUtils.setValue1(index, defaultValue1, value1s)
        OperateTypeArrayUtils.setValue2(index, defaultValue2, value2s)
    })

    return [value1s, value2s]
}

let _initBufferData = (count, defaultDataTuple): [ArrayBuffer, Array<TypeArrayType>] => {
    let buffer = createBuffer(count)

    let typeArrData = _setAllTypeArrDataToDefault(createTypeArrays(buffer, count), count, defaultDataTuple)

    return [buffer, typeArrData]
}

export let createState = (dataorientedComponentCount: number): state => {
    let defaultValue1 = default value1
    let defaultValue2 = default value2

    let [buffer, [value1s, value2s]] = _initBufferData(dataorientedComponentCount, [defaultValue1, defaultValue2])

    return {
        maxIndex: 0,
        buffer,
        value1s,
        value2s,
        gameObjectMap: Map(),
        gameObjectDataOrientedComponent1Map: Map(),
    }
}

export let createComponent = (state: state): [state, component] => {
    let index = state.maxIndex

    let newIndex = index + 1

    state = {
        ...state,
        maxIndex: newIndex
    }

    return [state, index]
}

export let getComponentExn = (state: state, gameObject: gameObject): component => {
    let { gameObjectMap } = state

    return getExnFromStrictNull(gameObjectMap.get(gameObject))
}

export let setComponent = (state: state, gameObject: gameObject, component: component): state => {
    let { gameObjectMap, gameObjectDataOrientedComponent1Map } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectDataOrientedComponent1Map: gameObjectDataOrientedComponent1Map.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectDataOrientedComponent1Map } = state

    return gameObjectDataOrientedComponent1Map.has(gameObject)
}

export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectDataOrientedComponent1Map } = state

    return gameObjectDataOrientedComponent1Map.toArray().map(([key, value]) => value)
}

export let getValue1 = (state: state, component: component) => {
    return OperateTypeArrayUtils.getValue1(component, state.value1s)
}

export let setValue1 = (state: state, component: component, position) => {
    OperateTypeArrayUtils.setValue1(component, position, state.value1s)

    return state
}

get/set value2...

export let batchOperate = (state: state) => {
    let allComponents = getAllComponents(state)

    console.log("批量操作")

    return state
}
```
dataoriented_component1/BufferUtils
```ts
// 这里只给出了两个value的情况
// 更多的value也以此类推...

let _getValue1Size = () => value1 size

let _getValue2Size = () => value2 size

export let getValue1Offset = () => 0

export let getValue2Offset = (count) => getValue1Offset() + getValue1Length(count) * TypeArray2.BYTES_PER_ELEMENT

export let getValue1Length = (count) => count * _getValue1Size()

export let getValue2Length = (count) => count * _getValue2Size()

export let getValue1Index = index => index * _getValue1Size()

export let getValue2Index = index => index * _getValue2Size()

let _getTotalByteLength = (count) => {
    return count * (TypeArray1.BYTES_PER_ELEMENT * (_getValue1Size() + TypeArray2.BYTES_PER_ELEMENT * (_getValue2Size())))
}

export let createBuffer = (count) => {
    return new ArrayBuffer(_getTotalByteLength(count))
}
```
dataoriented_component1/CreateTypeArrayUtils
```ts
export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, getValue1Offset(), getValue1Length(count)),
        new Float32Array(buffer, getValue2Offset(count), getValue2Length(count)),
    ]
}
```

- OtherComponentManager的抽象代码
other_component1/ManagerStateType
```ts
export type state = {
    maxUID: number,
    value1Map: Map<component, value1 type>,
    更多valueXMap...,

    gameObjectMap: Map<component, gameObject>,
    gameObjectOtherComponent1Map: Map<gameObject, component>,
}
```
other_component1/Manager
```ts
export let createState = (): state => {
    return {
        maxUID: 0,
        value1Map: Map(),
        gameObjectMap: Map(),
        gameObjectOtherComponent1Map: Map(),
    }
}

export let createComponent = (state: state): [state, component] => {
    let uid = state.maxUID

    let newUID = uid + 1

    state = {
        ...state,
        maxUID: newUID
    }

    return [state, uid]
}

export let getComponentExn = (state: state, gameObject: gameObject): component => {
    let { gameObjectMap } = state

    return getExnFromStrictNull(gameObjectMap.get(gameObject))
}

export let setComponent = (state: state, gameObject: gameObject, component: component): state => {
    let { gameObjectMap, gameObjectOtherComponent1Map } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectOtherComponent1Map: gameObjectOtherComponent1Map.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectOtherComponent1Map } = state

    return gameObjectOtherComponent1Map.has(gameObject)
}

export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectOtherComponent1Map } = state

    return gameObjectOtherComponent1Map.toArray().map(([key, value]) => value)
}

export let getValue1 = (state: state, component: component) => {
    return getExnFromStrictUndefined(state.value1Map.get(component))
}

export let setValue1 = (state: state, component: component, value1) => {
    return {
        ...state,
        value1Map: state.value1Map.set(component, value1)
    }
}

export let batchOperate = (state: state) => {
    let allComponents = getAllComponents(state)

    console.log("批量操作")

    return state
}
```

- GameObject的抽象代码
GameObjectType
```ts
type id = number

export type gameObject = id
```
- DataOrientedComponent的抽象代码
DataOrientedComponent1Type
```ts
type index = number

export type component = index
```
- OtherComponent的抽象代码
OtherComponent1Type
```ts
type id = number

export type component = id
```




## 遵循的设计原则在UML中的体现？

TODO finish



# 应用

## 优点

- 组件的数据集中连续地保存在ArrayBuffer中，增加了缓存命中，提高了读写的性能

- 创建和删除组件的性能也很好，因为在这个过程中不会分配或者销毁内存，所以没有垃圾回收的开销
这是因为在创建ArrayBuffer时就预先按照最大组件个数分配了一块连续的内存，所以在创建组件时，只是返回一个当前最大索引(maxIndex)加1的值而已；
在删除组件时，只是将该组件对应ArrayBuffer中的数据还原为默认值而已


- 职责划分明确，很清楚行为的逻辑应该放在哪里
如只涉及到操作一种组件的行为逻辑（如batchUpdate position），则将其放在该组件对应的Manager或者对应的System中；涉及到多种组件的行为逻辑则放在对应的System中；

- 增加行为很容易
因为一个行为对应一个System，所以要增加一个行为，则只需增加一个对应的System即可，这不会影响到Manager
另外，因为System只有逻辑没有数据，所以增加和维护System很容易


## 缺点

无

## 使用场景

### 场景描述

<!-- 有很多或者很复杂的行为的游戏或者应用 -->

适合于大型的游戏，里面有很多人物，人物的行为很多或者很复杂


### 具体案例

- 有很多个种类的游戏人物的游戏

将游戏人物改为GameObject+Component的组件化架构，通过挂载不同的组件取代继承，来实现不同种类的游戏人物

- 游戏人物有很多的行为，而且还经常会增加新的行为

将每个行为对应为一个System

增加新的行为就是增加一个System

不管行为如何变化，只影响System，不会影响Manager和GameObject、Component


## 注意事项

- 因为组件的ArrayBuffer一旦在创建后，它的大小就不会改动，所以最好在创建时指定足够大的最大组件个数


<!-- # 扩展 -->


# 结合其它模式

## 结合多线程模式

如果引擎开了多个线程，那么可以将组件的ArrayBuffer改为SharedArrayBuffer。这样的话就可以将其共享到线程worker中，而不需要拷贝，从而提高了性能



## 结合管道模式

如果引擎使用了管道模式，那么会去掉System模块，而使用管道的Job来代替，一个Job就是一个System
另外，也会去掉WorldState，而使用管道的PipelineState来代替


<!-- 
## 使用场景是什么？
## UML如何变化？
## 代码如何变化？ -->




# 最佳实践

## 哪些场景不需要使用模式？

如果游戏的人物种类很少，行为简单，那么就可以使用最开始给出的继承方案，使用一个人物模块对应一种人物


## 给出具体的实践案例？

<!-- 对于GeometryComponent组件，它的ArrayBuffer会保存顶点数据，如顶点、法线之类的数据。


实际开发引擎时需要处理GeometryComponent组件，它的ArrayBuffer会保存所有geometry组件的顶点数据
而一个geometry的顶点数据又包括很多个顶点的数据

所以在创建这个ArrayBuffer时，需要两个最大值：geometry组件最大个数、一个geometry的最大顶点数 

TODO tu
    explain ArrayBuffer 内存布局

TODO explain reallocate geometry vertices
-->




# 更多资料推荐

可以在网上搜索更多关于“组件化”、“Data Oriented”、“ECS”的资料

ECS的概念最先由“守望先锋”游戏的开发者提出的，详细资料可以搜索“《守望先锋》架构设计和网络同步”

很多游戏引擎都转为使用ECS的思想来设计架构