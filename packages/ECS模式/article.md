[TOC]

# [引入故事，提出问题]

## 需求


我们需要开发一个游戏，游戏中有两种人物：普通英雄和超级英雄，他们具有下面的行为：
普通英雄只能移动
超级英雄不仅能够移动，还能飞行

我们使用下面的方法来渲染：
使用Instance技术来一次性批量渲染所有的普通英雄
一个一个地渲染每个超级英雄


## 实现思路

应该有一个游戏世界，由多个普通英雄和多个超级英雄组成

分别使用一个模块来对应一个普通英雄和一个超级英雄，这个模块应该维护该英雄的数据和实现该英雄的行为



## 给出UML

**领域模型**
![image](https://img2023.cnblogs.com/blog/419321/202304/419321-20230407093907968-1066718182.png)


总体来看，分为用户、游戏世界、英雄这三个部分


我们看下用户、游戏世界这两个部分：

Client是用户

<!-- World负责游戏世界的管理，它包括了所有的普通英雄和超级英雄数据 -->
World是游戏世界，由多个普通英雄和多个超级英雄组成
World负责管理所有的英雄，并且实现了初始化和主循环的逻辑


我们看英雄这个部分：

一个NormalHero对应一个普通英雄，维护了该英雄的数据，实现了移动的行为

一个SuperHero对应一个超级英雄， 维护了该英雄的数据，实现了移动、飞行的行为


## 给出代码

首先，我们看下用户的代码；
然后，我们看下创建WorldState的代码
然后，我们看下创建场景的代码
然后，我们看下普通英雄移动的代码
然后，我们看下超级英雄移动和飞行的代码
然后，我们看下初始化的代码
然后，我们看下主循环的代码
然后，我们看下主循环中更新的代码
然后，我们看下主循环中渲染的代码
最后，我们运行代码


### 用户的代码

Client
```ts
let worldState = createState()

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState, [update, renderOneByOne, renderInstances])
```

我们首先创建了WorldState，用来保存游戏世界中所有的数据；
然后创建了场景；
然后进行了初始化；
最后开始了主循环



### 创建WorldState的代码

World
```ts
export let createState = (): worldState => {
    return {
        normalHeroes: Map(),
        superHeroes: Map()
    }
}
```

createState函数创建的WorldState保存了两个分别用来保存所有的normalHero和所有的superHero的容器


### 创建场景的代码

Client
```ts
let _createScene = (worldState: worldState): worldState => {
    创建和加入normalHero1到worldState
    创建和加入normalHero2到worldState

    normalHero1移动

    创建和加入superHero1到worldState
    创建和加入superHero2到worldState

    superHero1移动
    superHero1飞行

    return worldState
}

```

用户在创建的场景时，创建和加入了两个普通英雄和两个超级英雄到游戏世界中，其中第一个普通英雄进行了移动，第一个超级英雄进行了移动和飞行


NormalHero
```ts
//创建一个普通英雄
export let create = (): [normalHeroState, normalHero] => {
    创建它的state数据：
        position设置为[0,0,0]
        velocity设置为1.0

        其中：position为位置，velocity为速度

    返回该英雄
}
```

World
```ts
//加入一个普通英雄到游戏世界
export let addNormalHero = (worldState: worldState, [normalHeroState, normalHero]): worldState => {
    加入一个普通英雄到worldState.normalHeroes中
}
```

这是“创建和加入一个普通英雄到游戏世界”的相关代码

我们再看下“创建和加入一个超级英雄到游戏世界”的相关代码，它跟普通英雄的相关代码是类似的：
SuperHero
```ts
//创建一个超级英雄
export let create = (): [superHeroState, superHero] => {
    创建它的state数据：
        position设置为[0,0,0]
        velocity设置为1.0
        maxVelocity设置为1.0

        其中：position为位置，velocity为速度，maxVelocity为最大速度

    返回该英雄
}
```

World
```ts
//加入一个超级英雄到游戏世界
export let addSuperHero = (worldState: worldState, [superHeroState, superHero]): worldState => {
    加入一个超级英雄到worldState.superHeroes中
}
```




### 普通英雄移动的代码

NormalHero
```ts
//一个普通英雄的移动
export let move = (worldState: worldState, normalHero: normalHero): worldState => {
    从worldState中获得该英雄的position和velocity

    根据velocity，更新position

    更新worldState中该英雄的数据
}
```

move函数实现了移动的行为逻辑，更新了位置


### 超级英雄移动和飞行的代码

SuperHero
```ts
//一个超级英雄的移动
export let move = (worldState: worldState, superHero: superHero): worldState => {
    从worldState中获得该英雄的position和velocity

    根据velocity，更新position

    更新worldState中该英雄的数据
}

//一个超级英雄的飞行
export let fly = (worldState: worldState, superHero: superHero): worldState => {
    从worldState中获得该英雄的position和velocity、maxVelocity

    根据maxVelocity、velocity，更新position

    更新worldState中该英雄的数据
}
```

SuperHero的move函数的逻辑跟NormalHero的move函数的逻辑是一样的

fly函数实现了飞行的行为逻辑
它跟move函数一样，也是更新superHero的position，只是因为两者在计算时使用的速度的算法不一样，所以更新position的幅度不同

### 初始化的代码

World
```ts
export let init = (worldState) => {
    console.log("初始化...")

    return worldState
}
```

这里的初始化init函数中没有任何逻辑，只是进行了打印

### 主循环的代码

utils->World
```ts
export let loop = (worldState, [update, renderOneByOne, renderInstances]) => {
    worldState = update(worldState)
    renderOneByOne(worldState)
    renderInstances(worldState)

    ...
}
```

在每次主循环中，首先进行了更新；
然后一个一个地渲染了所有的超级英雄；
最后一次性批量渲染了所有的普通英雄


### 主循环中更新的代码

World
```ts
export let update = (worldState: worldState): worldState => {
    遍历worldState.normalHeroes：
        更新每个normalHero
    遍历worldState.superHeroes：
        更新每个superHero
}
```
update函数会遍历所有的normalHero和superHero，调用它们的update函数来更新自己

我们看下NormalHero的update代码：
```ts
//更新一个普通英雄
export let update = (normalHeroState: normalHeroState): normalHeroState => {
    更新该英雄的position
}
```

它更新了自己的position

我们看下SuperHero的update代码：
```ts
//更新一个超级英雄
export let update = (superHeroState: superHeroState): superHeroState => {
    更新该英雄的position
}
```

它的逻辑跟NormalHero的update是一样的，这是因为两者都使用同样的算法来更新自己的position


### 主循环中渲染的代码

<!-- 我们回到主循环代码，来看下更新之后的渲染相关的代码： -->
World
```ts
export let renderOneByOne = (worldState: worldState): void => {
    worldState.superHeroes.forEach(superHeroState => {
        console.log("OneByOne渲染 SuperHero...")
    })
}

export let renderInstances = (worldState: worldState): void => {
    let normalHeroStates = worldState.normalHeroes

    console.log("批量Instance渲染 NormalHeroes...")
}
```

renderOneByOne函数实现了超级英雄的渲染
renderInstances函数实现了普通英雄的渲染


### 运行代码

下面，我们运行代码，运行结果如下：
```text
初始化...
更新NormalHero
更新NormalHero
更新SuperHero
更新SuperHero
OneByOne渲染 SuperHero...
OneByOne渲染 SuperHero...
批量Instance渲染 NormalHeroes...
{"normalHeroes":{"144891":{"position":[0,0,0],"velocity":1},"648575":{"position":[2,2,2],"velocity":1}},"superHeroes":{"497069":{"position":[6,6,6],"velocity":1,"maxFlyVelocity":10},"783438":{"position":[0,0,0],"velocity":1,"maxFlyVelocity":10}}}
```

通过打印的数据，可以看到运行的步骤如下：
首先进行了初始化；
然后更新了所有的人物，包括两个普通英雄和两个超级英雄；
然后依次渲染了2个超级英雄；
然后一次性批量渲染了所有的普通英雄；
最后打印了worldState

我们看下打印的worldState：
worldState的normalHeroes中有一个普通英雄数据的position为[2,2,2]而不是初始的[0,0,0]，说明该普通英雄进行了move操作；
worldState的superHeroes中有一个超级英雄数据的position为[6,6,6]，说明该超级英雄进行了move和fly操作

值得注意的是：
因为worldState的normalHeroes和superHeroes中的Key是随机生成的id值，所以每次打印时都不一样




## 提出问题

- NormalHero和SuperHero中的update、move函数的逻辑是重复的

- 如果英雄增加更多的行为，NormalHero和SuperHero模块会越来越复杂，不容易维护
虽然可以通过继承来解决，即最上面是Hero基类，然后不同种类的Hero层层继承，但是继承的方式很死板，不够灵活


# [给出可能的改进方案，分析存在的问题]?


## 概述解决方案？


<!-- 通过下面的改进来解决重复和继承的问题： -->
- 基于组件化的思想，用组合代替继承
将英雄抽象为GameObject
将英雄的行为抽象为组件，并把英雄的相关数据也移到组件中
英雄通过挂载不同的组件，来实现不同的行为

<!-- 这样NormalHero、SuperHero都是GameObject，只是挂载不同的组件而已 -->




## 给出UML？

**领域模型**
![image](https://img2023.cnblogs.com/blog/419321/202304/419321-20230407093910175-912066482.png)

总体来看，分为用户、游戏世界、GameObject、组件这四个部分

我们看下用户、游戏世界这两个部分：
Client是用户

World是游戏世界，由多个GameObject组成
World负责管理所有的GameObject，并且实现了初始化和主循环的逻辑


我们看下GameObject这个部分：

一个GameObject对应一个英雄
GameObject负责管理挂载的组件，它可以挂载PositionComponent、VelocityComponent、FlyComponent、InstanceComponent这四种组件，每种组件最多挂载一个


我们看下组件这个部分：

组件负责维护自己的数据，实现自己的行为逻辑
具体来说，是将NormalHero、SuperHero的position数据和move函数、update函数移到了PositionComponent中；
将NormalHero、SuperHero的velocity数据移到了VelocityComponent中；
将SuperHero的maxVelocity数据和fly函数移到了FlyComponent中；
InstanceComponent没有数据和逻辑，它只是一个标记，用来表示挂载该组件的GameObject使用一次性批量渲染的算法来渲染



## 结合UML图，描述如何具体地解决问题？

- 现在只需要实现一次Position组件中的update、move函数，然后将它挂载到不同的GameObject中，就可以实现普通英雄和超级英雄的更新、移动的逻辑，从而消除了之前在NormalHero、SuperHero中共实现了两次的update、move函数造成的重复代码


- 因为NormalHero、SuperHero都是GameObject，而GameObject本身只负责管理组件，没有行为逻辑，所以随着英雄的行为的增加，GameObject并不会增加逻辑，而只需要增加对应行为的组件，让GameObject挂载该组件即可
通过这样的设计，将行为的逻辑和数据从英雄移到了组件中，从而可以通过组合的方式使英雄具有多个行为，避免了庞大的英雄模块的出现


## 给出代码？

首先，我们看下用户的代码；
然后，我们看下创建WorldState的代码
然后，我们看下创建场景的代码
然后，我们看下GameObject操作组件的代码
然后，我们看下移动的相关代码
然后，我们看下飞行的相关代码
然后，我们看下初始化和主循环的代码
然后，我们看下主循环中更新的代码
然后，我们看下主循环中渲染的代码
最后，我们运行代码


### 用户的代码

Client
```ts
let worldState = createState()

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState, [update, renderOneByOne, renderInstances])
```

Client的代码跟之前的Client的代码一样，除了_createScene函数中创建场景的方式不一样，这个等会再讨论


### 创建WorldState的代码

World
```ts
export let createState = (): worldState => {
    return {
        gameObjects: Map()
    }
}
```

createState函数创建的WorldState保存了一个用来保存所有的gameObject的容器

### 创建场景的代码

Client
```ts
let _createScene = (worldState: worldState): worldState => {
    创建和加入normalHero1到worldState：
        创建gameObject
        创建positionComponent
        创建velocityComponent
        创建instanceComponent
        挂载positionComponent、velocityComponent、instanceComponent到gameObject
        加入gameObject到worldState

    创建和加入normalHero2到worldState

    normalHero1移动：
        调用normalHero1的gameObject挂载的positionComponent的move函数

    创建和加入superHero1到worldState：
        创建gameObject
        创建positionComponent
        创建velocityComponent
        创建flyComponent
        挂载positionComponent、velocityComponent、flyComponent到gameObject
        加入gameObject到worldState

    创建和加入superHero2到worldState

    superHero1移动：
        调用superHero1的gameObject挂载的positionComponent的move函数
    superHero1飞行：
        调用superHero1的gameObject挂载的flyComponent的fly函数

    return worldState
}

```

用户创建的场景的内容跟之前一样，都包括了2个普通英雄和2个超级英雄，只是现在创建一个英雄的方式改变了，具体变为：
首先创建一个GameObject和相关的组件；
然后挂载组件到GameObject；
最后加入该GameObject到World中

普通英雄对应的GameObject挂载的组件跟超级英雄对应的GameObject挂载的组件也不一样，不一样的组件是前者挂载了InstanceComponent（因为普通英雄需要一次性批量渲染），后者则挂载了FlyComponent（因为超级英雄多出了飞行的行为）

另外，现在改为通过调用组件的函数而不是直接操作英雄模块来实现英雄的“移动”、“飞行”




<!-- 我们继续看创建场景相关的剩余代码：
GameObject的相关代码如下： -->
<!-- GameObjectStateType
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
gameObjectState中保存了该gameObject挂载的所有组件的state数据 -->

GameObject
```ts
//创建一个gameObject
export let create = (): [gameObjectState, gameObject] => {
    创建它的state数据：
        没有挂载任何的组件

    返回该gameObject
}

//挂载positionComponent
export let setPositionComponent = (gameObjectState: gameObjectState, gameObject: gameObject, positionComponentState): gameObjectState => {
    挂载该positionComponent到该gameObject
}

挂载其它组件...
```

<!-- GameObject负责创建gameObject和管理挂载的组件 -->


PositionComponent
```ts
//创建一个positionComponent
export let create = (): positionComponentState => {
    创建它的state数据：
        gameObject设置为null
        position设置为[0,0,0]

        其中：position为位置，gameObject为挂载到的gameObject

    返回该组件
}
```

VelocityComponent
```ts
//创建一个velocityComponent
export let create = (): velocityComponentState => {
    创建它的state数据：
        gameObject设置为null
        velocity设置为1.0

        其中：velocity为速度，gameObject为挂载到的gameObject

    返回该组件
}
```

FlyComponent
```ts
//创建一个flyComponent
export let create = (): flyComponentState => {
    创建它的state数据：
        gameObject设置为null
        maxVelocity设置为1.0

        其中：maxVelocity为最大速度，gameObject为挂载到的gameObject

    返回该组件
}
```
InstanceComponent
```ts
//创建一个instanceComponent
export let create = (): flyComponentState => {
    创建它的state数据：
        gameObject设置为null

        其中：gameObject为挂载到的gameObject

    返回该组件
}
```


World
```ts
export let addGameObject = (worldState: worldState, [gameObjectState, gameObject]): worldState => {
    加入一个gameObject到worldState.gameObjects中
}
```



这是“创建一个gameObject和对应组件、挂载组件到gameObject、加入gameObject到游戏世界”的相关代码

组件的state中都保存了挂载到的gameObject，这样做的目的是可以通过gameObject来获得挂载到该gameObject的其它组件，从而在一个组件中可以操作其它挂载的组件



### GameObject操作组件的代码

GameObject
```ts
//获得一个gameObject的positionComponent组件
export let getPositionComponentExn = ({ positionComponent }: gameObjectState): positionComponentState => {
    获得该gameObject挂载的positionComponent
}

更多获得其它组件的函数...

//判断一个gameObject是否挂载了positionComponent组件
export let hasPositionComponent = ({ positionComponent }: gameObjectState): boolean => {
    判断该gameObject是否挂载了positionComponent
}

更多has其它组件函数...
```

<!-- GameObject负责创建gameObject和管理挂载的组件 -->
这是GameObject中除了挂载组件以外的操作组件的代码

### 移动的相关代码

<!-- 组件与GameObject一样，我们将它的数据保存在一个state中，只是不需要索引。所以一个组件就等于一个组件state -->

<!-- 
组件的相关代码如下：
PositionComponentStateType
```ts
export type state = {
    gameObject: gameObject | null,
    position: [number, number, number]
}
```

组件state中保存了挂载到的gameObject，这样可以通过gameObject来获得挂载到gameObject的其它组件，从而获得其它组件的数据 -->

PositionComponent
```ts
...

//获得一个组件的position
export let getPosition = (positionComponentState: positionComponentState) => {
    return positionComponentState.position
}

//设置一个组件的position
export let setPosition = (positionComponentState: positionComponentState, position) => {
    return {
        ...positionComponentState,
        position: position
    }
}

...

//一个组件的移动
export let move = (worldState: worldState, positionComponentState: positionComponentState): worldState => {
    //获得该组件的position、gameObject
    let [x, y, z] = getPosition(positionComponentState)

    //通过该组件的gameObject，获得挂载到该gameObject的velocityComponent组件
    //获得它的velocity
    let gameObject = getExnFromStrictNull(positionComponentState.gameObject)
    let velocity = VelocityComponent.getVelocity(GameObject.getVelocityComponentExn(getGameObjectStateExn(worldState, gameObject)))

    //根据velocity，更新该组件的position
    positionComponentState = setPosition(positionComponentState, [x + velocity, y + velocity, z + velocity])

    更新worldState中该组件挂载的gameObject中的该组件的数据
}
```
VelocityComponent
```ts
//获得一个组件的velocity
export let getVelocity = (velocityComponentState: velocityComponentState) => {
    return velocityComponentState.velocity
}
```

PositionComponent维护了position数据，实现了移动的行为逻辑

VelocityComponent维护了velocity数据



### 飞行的相关代码

<!-- FlyComponentStateType
```ts
export type state = {
    gameObject: gameObject | null,
    maxVelocity: number
}
``` -->
FlyComponent
```ts
//获得一个组件的maxVelocity
export let getMaxVelocity = (flyComponentState: flyComponentState) => {
    return flyComponentState.maxVelocity
}

//设置一个组件的maxVelocity
export let setMaxVelocity = (flyComponentState: flyComponentState, maxVelocity) => {
    return {
        ...flyComponentState,
        maxVelocity: maxVelocity
    }
}

//一个组件的飞行
export let fly = (worldState: worldState, flyComponentState: flyComponentState): worldState => {
    //获得该组件的maxVelocity、gameObject
    let maxVelocity = getMaxVelocity(flyComponentState)
    let gameObject = getExnFromStrictNull(flyComponentState.gameObject)

    //通过该组件的gameObject，获得挂载到该gameObject的positionComponent组件
    //获得它的position
    let [x, y, z] = PositionComponent.getPosition(GameObject.getPositionComponentExn(getGameObjectStateExn(worldState, gameObject)))

    //通过该组件的gameObject，获得挂载到该gameObject的velocityComponent组件
    //获得它的velocity
    let velocity = VelocityComponent.getVelocity(GameObject.getVelocityComponentExn(getGameObjectStateExn(worldState, gameObject)))

    //根据maxVelocity、velocity，更新positionComponent组件的position
    velocity = velocity < maxVelocity ? (velocity * 2.0) : maxVelocity
    let positionComponentState = PositionComponent.setPosition(GameObject.getPositionComponentExn(getGameObjectStateExn(worldState, gameObject)), [x + velocity, y + velocity, z + velocity])

    更新worldState中该组件挂载的gameObject中的该组件的数据
}
```

FlyComponent维护了maxVelocity数据，实现了飞行的行为逻辑


### 初始化和主循环的代码

初始化和主循环的逻辑跟之前一样，故省略代码


### 主循环中更新的代码


<!-- 

现在回到Client，继续看创建场景之后的逻辑
Client
```ts
worldState = init(worldState)

loop(worldState, [update, renderOneByOne, renderInstances])
```

这里的步骤跟之前一样，初始化和主循环的逻辑也完全一样

不一样的地方是主循环中的更新、渲染的逻辑不一样 -->

World
```ts
export let update = (worldState: worldState): worldState => {
    遍历worldState.gameObjects：
        if(gameObject挂载了positionComponent){
            更新positionComponent
        }
}
```

update函数会遍历所有的gameObject，调用它挂载的PositionComponent组件的update函数来更新该组件


我们看PositionComponent的update代码：
```ts
//更新一个组件
export let update = (positionComponentState: positionComponentState): positionComponentState => {
    更新该组件的position
}
```

它的逻辑跟之前的NormalHero和SuperHero中的update函数的逻辑是一样的


### 主循环中渲染的代码


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

    console.log("批量Instance渲染 NormalHeroes...")
}
```

这里判断gameObject是否挂载了InstanceComponent组件，如果挂载则批量渲染，否则一个一个地渲染


### 运行代码

下面，我们运行代码，运行结果如下：
```text
初始化...
更新PositionComponent
更新PositionComponent
更新PositionComponent
更新PositionComponent
OneByOne渲染 SuperHero...
OneByOne渲染 SuperHero...
批量Instance渲染 NormalHeroes...
{"gameObjects":{"304480":{"positionComponent":{"gameObject":304480,"position":[0,0,0]},"velocityComponent":{"gameObject":304480,"velocity":1},"flyComponent":{"gameObject":304480,"maxVelocity":10},"instanceComponent":null},"666533":{"positionComponent":{"gameObject":666533,"position":[2,2,2]},"velocityComponent":{"gameObject":666533,"velocity":1},"flyComponent":null,"instanceComponent":{"gameObject":666533}},"838392":{"positionComponent":{"gameObject":838392,"position":[0,0,0]},"velocityComponent":{"gameObject":838392,"velocity":1},"flyComponent":null,"instanceComponent":{"gameObject":838392}},"936933":{"positionComponent":{"gameObject":936933,"position":[6,6,6]},"velocityComponent":{"gameObject":936933,"velocity":1},"flyComponent":{"gameObject":936933,"maxVelocity":10},"instanceComponent":null}}}
```

通过打印的数据，可以看到运行的步骤与之前一样
不同之处在于：
更新4个英雄现在变为更新4个positionComponent；
打印的worldState不一样


我们看下打印的worldState：
worldState的gameObjects包括了4个gameObject的数据；
有一个gameObject数据的positionComponent的position为[2,2,2]，说明它进行了move操作；
有一个gameObject数据的positionComponent的position为[6,6,6]，说明它进行了move和fly操作


值得注意的是：
因为worldState的gameObjects中的Key是随机生成的id值，所以每次打印时都不一样


## 提出问题

- 组件的数据分散在各个组件中，性能不好
如position数据现在是一对一地分散保存在各个positionComponent组件中（即一个positionComponent组件保存自己的position），那么如果需要遍历所有组件的position数据，则需要遍历所有的positionComponent组件，分别获得它们的position
因为每个positionComponent组件的数据并没有连续地保存在内存中，所以会造成缓存命中丢失，带来性能损失

<!-- 因为在遍历每个positionComponent组件时，需要将它的所有数据都载入CPU的二级缓存中 -->
<!-- 当它的大小大于CPU的二级缓存的大小时，就无法载入而造成缓存无法命中，从而带来性能损失 -->
<!-- 当它的大小大于CPU的二级缓存的大小时，就无法全部载入，而需要
而造成缓存无法命中，从而带来性能损失 -->

- 如果超级英雄增加一个“跳”的行为，该行为不仅会更新position，还会修改速度velocity，那么该行为对应的jump函数应该放在哪个组件中呢？
因为jump函数需要同时修改PositionComponent组件和VelocityComponent组件的数据，所以将它放在其中的任何一种组件都不合适
因此需要增加一种新的组件-JumpComponent，对应“跳”这个行为，实现jump函数
该函数会通过JumpComponent挂载的gameObject来获得挂载到该gameobject上的PositionComponent和VelocityComponent组件，修改它们的数据

如果增加更多的涉及多种组件的行为，就需要为每个行为增加一种组件。
因为组件比较重，既有数据又有逻辑，所以增加组件的开发成本较高
另外，因为组件与GameObject是聚合关系，而GameObject和World也是聚合关系，它们都属于强关联关系，所以增加组件会较强地影响GameObject和World，这也增加了开发成本



# [给出使用模式的改进方案]

## 概述解决方案

<!-- 通过下面的改进来提高性能： -->
- 基于Data Oriented的思想进行改进
<!-- 基于Data Oriented的思想进行改进，将gameObject所有的数据和每种组件的数据分别集中起来，保存在各自的一块连续空间中 -->
<!-- 其中，gameObject的数据是指gameObject挂载了哪些组件，我们将其保存在一个Hash Map中； -->
组件可以按角色分为Data Oriented组件和其它组件，前者的特点是每个组件都有数据，且组件的数量较多，后者的特点是每个组件都没有数据，或者组件的数量很少
这里具体说明一下各种组件的角色：
目前一共有四种组件，它们为：PositionComponent、VelocityComponent、FlyComponent、InstanceComponent。InstanceComponent组件因为没有组件数据，所以属于“其它组件”；另外三种组件则都属于“Data Oriented组件”

将属于Data Oriented组件的三种组件的所有组件数据分别集中起来，保存在各自的一块连续的地址空间中，具体就是分别保存在三个ArrayBuffer中

- 将GameObject和各个Component扁平化
使得GameObject不再有数据和逻辑了，而只是一个id；Component也不再有数据和逻辑了，属于“Data Oriented组件”的Component只是一个ArrayBuffer的索引；属于“其它组件”的Component只是一个id
<!-- 其中GameObject是gameObject与挂载的组件的对应关系这个Hash Map的Key；Component既是这个Hash Map的Value，又是ArrayBuffer中的索引 -->

- 增加Component+GameObject这一层，将扁平的GameObject和Componet放在该层中


- 增加Manager这一层，来管理GameObject和组件的数据
这一层有GameObjectManager和四种组件的Manager，其中GameObjectManager负责管理所有的gameObject；
四种组件的Manager负责管理自己的ArrayBuffer，操作属于该种类的所有组件

值得注意的是：
<!-- 将“gameObject挂载了哪些组件”的对应关系的Hash Map放在哪里？ -->
将“gameObject挂载了哪些组件”的数据放在哪里？
它们可以放在GameObjectManager中，也可以分散地放在各个组件的Manager中。
考虑到为了方便组件直接就近获得自己挂载到的GameObject，所以我们选择后者


- 增加System这一层，来实现行为的逻辑
一个System对应一个行为，比如这一层中的MoveSystem、FlySystem分别实现了移动和飞行的行为逻辑


值得注意的是：
1.GameObject和Component的数据被移到了Manager中，它们的逻辑则被移到了Manager和System中，其中只操作自己的逻辑（如getPosition、setPosition）被移到了Manager中，其它逻辑（即行为逻辑，通常需要操作多种组件）被移到了System中
2.一种组件的Manager只对该种组件进行操作，而一个System可以对多种组件进行操作

## 给出UML？


**领域模型**
![image](https://img2023.cnblogs.com/blog/419321/202304/419321-20230407093913041-1386894617.png)



总体来看，分为五个部分：用户、World、System层、Manager层、Component+GameObject层，它们的依赖关系是用户依赖World，World依赖System层，System层依赖Manager层，Manager层依赖Component+GameObject层


我们看下用户、World这两个部分：
Client是用户

World是游戏世界，虽然仍然实现了初始化和主循环的逻辑，不过不再管理所有的GameObject了


我们看下System这一层：
有多个System，每个System实现一个行为逻辑
其中，CreateStateSystem实现创建WorldState的逻辑，创建的WorldState包括了所有的Manager的state数据；
UpdateSystem实现更新所有人物的position的逻辑，具体是更新所有PositionComponent的position；
MoveSystem实现一个人物的移动的逻辑，具体是根据挂载到该人物gameObject上的一个positionComponent和一个velocityComponent，更新该positionComponent的position；
FlySystem实现一个人物的飞行的逻辑，具体是根据挂载到该人物gameObject上的一个positionComponent、一个velocityComponent、一个flyComponent，更新该positionComponent的position；
RenderOneByOneSystem实现渲染所有超级英雄的逻辑；
RenderInstancesSystem实现渲染所有普通英雄的逻辑


我们看下Manager这一层：

GameObjectManager负责管理所有的gameObject

PositionComponentManager、VelocityComponentManager、FlyComponentManager、InstanceComponentManager负责管理属于各自种类的所有的组件


PositionComponentManager的batchUpdate函数负责批量更新所有的positionComponent的position

<!-- PositionComponentManager维护了gameObjectMap、gameObjectPositionMap这两个Hash Map，前者为positionComponent与gameObject的对应关系，后者为gameObject与positionComponent的对应关系 -->


因为VelocityComponentManager、FlyComponentManager与PositionComponentManager类似（只是没有batchUpdate函数），故在图中省略它们的数据和函数



我们看下Component+GameObject这一层：
因为PositionComponent、VelocityComponent、FlyComponent属于Data Oriented组件，所以它们是一个index，也就是各自Manager中维护的ArrayBuffer中的索引值；
因为InstanceComponent属于其它组件，所以它是一个id，它是InstanceComponentManager维护的gameObjectMap的Key和gameObjectInstanceMap的Value

GameObject是一个id，它是各个组件Manager中的gameObjectMap的Value和gameObjectXxxMap中的Key


## 结合UML图，描述如何具体地解决问题？

- 现在各种组件的数据都集中保存在各自的Manager的ArrayBuffer中。因为ArrayBuffer的数据是连续地保存在内存中的，所以在遍历同一种组件的所有组件数据时缓存命中不会丢失，从而提高了性能

- 现在将涉及多种组件的行为放在对应的System中。因为System很轻，没有数据，只有逻辑，所以增加和维护System的成本较低；另外，因为System位于最上层，所以修改System也不会影响Manager层和Component+GameObject层




## 给出代码？

首先，我们看下用户的代码；
然后，我们看下创建WorldState的代码
然后，我们看下创建ArrayBuffer的代码
然后，我们看下创建场景的代码
然后，我们看下GameObject操作组件的代码
然后，我们看下移动的相关代码
然后，我们看下飞行的相关代码
然后，我们看下初始化和主循环的代码
然后，我们看下主循环中更新的代码
然后，我们看下主循环中渲染的代码
最后，我们运行代码


### 用户的代码

Client
```ts
let worldState = createState({ positionComponentCount: 10, velocityComponentCount: 10, flyComponentCount: 10 })

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState, [update, renderOneByOne, renderInstances])
```

Client的代码跟之前的Client的代码基本一样，除了createState函数的参数和_createScene函数中创建场景的方式不一样

### 创建WorldState的代码

Client通过调用CreateStateSystem的createState函数来创建WorldState

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

createState函数创建的WorldState包括了各个Manager的state

因为Data Oriented组件的Manager的state在创建时要创建包括该种组件的所有组件数据的ArrayBuffer，需要知道该种组件的最大个数，所以这里的createState函数接收了三种Data Oriented组件的最大个数


### 创建ArrayBuffer的代码

我们来看下创建ArrayBuffer的相关代码：
我们以PositionComponent组件为例，来看下PositionComponentManager的createState函数的相关代码：
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

buffer字段保存了一个ArrayBuffer，它用来保存所有的positionComponent的数据。目前每个positionComponent的数据只有position，它是三个float
positions字段保存了ArrayBuffer的一个视图，通过它可以读写所有的positionComponent的position

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

这是PositionComponentManager的createState函数的代码

在createState函数调用的_initBufferData函数中，首先调用createBuffer函数创建了包括最大组件个数的数据的ArrayBuffer；
然后调用createTypeArrays函数创建了所有的TypeArray，它是操作ArrayBuffer的视图。这里具体就是创建了一个视图：positions；
最后调用_setAllTypeArrDataToDefault函数将positions的所有的值写为默认值：[0,0,0]

<!-- 下面是创建ArrayBuffer和视图相关代码： -->
下面是createBuffer和createTypeArrays函数相关代码：
position_component/BufferUtils
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
position_component/CreateTypeArrayUtils
```ts
export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, getPositionOffset(count), getPositionLength(count))
    ]
}
```

另外两种Data Oriented组件的Manager（VelocityComponentManager、FlyComponentManager）的createState函数的逻辑跟PositionComponentManager的createState函数的逻辑一样，故省略相关代码



### 创建场景的代码

Client
```ts
let _createScene = (worldState: worldState): worldState => {
    创建normalHero1：
        创建gameObject
        创建positionComponent
        创建velocityComponent
        创建instanceComponent
        挂载positionComponent、velocityComponent、instanceComponent到gameObject

    创建normalHero2

    normalHero1移动：
        调用MoveSystem的move函数，传入normalHero1的positionComponent、velocityComponent

    创建superHero1
        创建gameObject
        创建positionComponent
        创建velocityComponent
        创建flyComponent
        挂载positionComponent、velocityComponent、flyComponent到gameObject

    创建superHero2

    superHero1移动：
        调用MoveSystem的move函数，传入superHero1的positionComponent、velocityComponent
    superHero1飞行：
        调用FlySystem的fly函数，传入superHero1的positionComponent、velocityComponent、flyComponent

    return worldState
}
```

<!-- 创建state之后，就创建了场景 -->


用户创建的场景的内容跟之前一样，都包括了2个普通英雄和2个超级英雄，只是现在创建一个英雄的方式又改变了，具体变为：
现在不需要加入GameObject到World中

另外，让人物进行“移动”、“飞行”改为通过调用MoveSystem和FlySystem的函数操作对应的组件来实现



<!-- 我们来看下创建场景中除了“move”、“fly”以外的相关代码：
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

SceneAPI提供了创建场景的API -->


<!-- GameObjectManager的相关代码如下：
gameObject/ManagerState
```ts
export type state = {
    maxUID: number
}
 ``` -->
gameObject/Manager
```ts
export let createState = (): state => {
    return {
        maxUID: 0
    }
}

//创建一个gameObject
//一个gameObject就是一个id
export let createGameObject = (state: state): [state, gameObject] => {
    let uid = state.maxUID

    //生成一个id
    //uid的意思是unique id，即全局唯一的id
    let newUID = uid + 1

    state = {
        ...state,
        maxUID: newUID
    }

    return [state, uid]
}
```
PositionComponentManager的相关代码如下：
position_component/Manager
```ts
//创建一个positionComponent
//一个positionComponent就是一个index
export let createComponent = (state: state): [state, component] => {
    let index = state.maxIndex
        
    //生成一个index
    let newIndex = index + 1

    state = {
        ...state,
        maxIndex: newIndex
    }

    return [state, index]
}

//挂载positionComponent
export let setComponent = (state: state, gameObject: gameObject, component: component): state => {
    let { gameObjectMap, gameObjectPositionMap } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectPositionMap: gameObjectPositionMap.set(gameObject, component)
    }
}
```

这是“创建一个gameObject和一个positionComponent组件、挂载positionComponent组件到gameObject”的相关代码

值得注意的是：
因为“gameObject挂载了哪些组件”的数据（如这里的gameObjectPositionMap）是放在组件Manager（如这里的PositionComponentManager）中的，所以挂载组件的代码也放在组件Manager（如这里的PositionComponentManager）而不是GameObjectManager中


VelocityComponentManager、FlyComponentManager相关代码跟PositionComponentManager类似，故省略相关代码



InstanceComponentManager相关代码也跟PositionComponentManager类似，除了createComponent函数稍微有点不同，我们来看下它的代码：
<!-- createComponent的代码为： -->
instance_component/Manager
```ts
//创建一个instanceComponent
//一个instanceComponent就是一个id
export let createComponent = (state: state): [state, component] => {
    let uid = state.maxUID

    //生成一个id
    let newUID = uid + 1

    state = {
        ...state,
        maxUID: newUID
    }

    return [state, uid]
}
```

因为InstanceComponent组件属于“其它组件”，所以它跟GameObject一样都是一个id而不是一个index



### GameObject操作组件的代码

position_component/Manager
```ts
//获得一个gameObject的positionComponent组件
export let getComponentExn = (state: state, gameObject: gameObject): component => {
    let { gameObjectMap } = state

    return getExnFromStrictNull(gameObjectMap.get(gameObject))
}

//判断一个gameObject是否挂载了positionComponent组件
export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectPositionMap } = state

    return gameObjectPositionMap.has(gameObject)
}
```

这是PositionComponentManager中除了挂载组件以外的与GameObject相关的操作组件的代码




### 移动的相关代码



MoveSystem
```ts
//一个positionComponent组件的移动
export let move = (worldState: worldState, positionComponent, velocityComponent): worldState => {
    let [x, y, z] = PositionComponentManager.getPosition(worldState.positionComponentManagerState, positionComponent)

    let velocity = VelocityComponentManager.getVelocity(worldState.velocityComponentManagerState, velocityComponent)

    //根据velocity，更新positionComponent的position
    let positionComponentManagerState = PositionComponentManager.setPosition(worldState.positionComponentManagerState, positionComponent, [x + velocity, y + velocity, z + velocity])

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }
}
```

MoveSystem实现了移动的行为逻辑

这里涉及到读写Data Oriented组件的ArrayBuffer上的数据，我们来看下读写PositionComponentManager的positions的相关代码：
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
position_component/BufferUtils
```ts
let _getPositionSize = () => 3

...

export let getPositionIndex = index => index * _getPositionSize()
```

这里的实现“读写PositionComponentManager的ArrayBuffer”的思路是：
因为一个positionComponent的值为ArrayBuffer的索引，所以使用它来读写ArrayBuffer的视图positions中的对应数据

### 飞行的相关代码

FlySystem
```ts
//一个positionComponent组件的飞行
export let fly = (worldState: worldState, positionComponent, velocityComponent, flyComponent): worldState => {
    let [x, y, z] = PositionComponentManager.getPosition(worldState.positionComponentManagerState, positionComponent)

    let velocity = VelocityComponentManager.getVelocity(worldState.velocityComponentManagerState, velocityComponent)

    let maxVelocity = FlyComponentManager.getMaxVelocity(worldState.flyComponentManagerState, flyComponent)

    //根据maxVelociy、velocity，更新positionComponent的position
    velocity = velocity < maxVelocity ? (velocity * 2.0) : maxVelocity
    let positionComponentManagerState = PositionComponentManager.setPosition(worldState.positionComponentManagerState, positionComponent, [x + velocity, y + velocity, z + velocity])

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }

}
```

FlySystem实现了飞行的行为逻辑


### 初始化和主循环的代码

初始化和主循环的逻辑跟之前一样，故省略代码


### 主循环中更新的代码



<!-- 现在回到Client，继续看创建场景之后的逻辑
Client
```ts
worldState = init(worldState)

loop(worldState, [UpdateSystem.update, RenderOneByOneSystem.render, RenderInstancesSystem.render])
```

这里的步骤跟之前一样，初始化和主循环的逻辑也完全一样 -->

<!-- 不一样的地方是主循环中的更新、渲染的逻辑是通过调用对应的System实现的 -->


现在调用UpdateSystem来实现更新，相关代码如下：
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

UpdateSystem的update函数调用了PositionComponentManager的batchUpdate函数来批量更新所有的positionComponent组件

我们看下PositionComponentManager的相关代码：
position_component/Manager
```ts
export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectPositionMap } = state

    return gameObjectPositionMap.toArray().map(([key, value]) => value)
}

export let batchUpdate = (state: state) => {
    return getAllComponents(state).reduce((state, component) => {
        更新position
    }, state)
}
```


batchUpdate函数会遍历所有的positionComponent，更新它的position
更新的逻辑跟之前一样



### 主循环中渲染的代码


现在调用RenderOneByOneSystem和RenderInstancesSystem来实现渲染，相关代码如下：
RenderOneByOneSystem
```ts
export let render = (worldState: worldState): void => {
    let superHeroGameObjects = GameObjectManager.getAllGameObjects(worldState.gameObjectManagerState).filter(gameObject => {
        //判断gameObject是不是没有挂载InstanceComponent
        return !InstanceComponentManager.hasComponent(worldState.instanceComponentManagerState, gameObject)
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

    //返回[0, 1, ...,  maxUID-1]的数组
    return range(0, maxUID - 1)
}
```


首先，RenderOneByOneSystem通过GameObjectManager获得所有的gameObject；
然后过滤它们，获得所有的没有挂载InstanceComponent组件的gameObject，它们就是所有的超级英雄；
最后一个一个地渲染

RenderInstancesSystem
```ts
export let render = (worldState: worldState): void => {
    let normalHeroGameObejcts = GameObjectManager.getAllGameObjects(worldState.gameObjectManagerState).filter(gameObject => {
        return InstanceComponentManager.hasComponent(worldState.instanceComponentManagerState, gameObject)
    })

    console.log("批量Instance渲染 NormalHeroes...")
}
```

RenderInstancesSystem则是获得所有挂载InstanceComponent组件的gameObject，它们就是所有的普通英雄；
最后一次性批量渲染



### 运行代码

下面，我们运行代码，运行结果如下：
```text
初始化...
更新PositionComponent: 0
更新PositionComponent: 1
更新PositionComponent: 2
更新PositionComponent: 3
OneByOne渲染 SuperHero...
OneByOne渲染 SuperHero...
批量Instance渲染 NormalHeroes...
{"gameObjectManagerState":{"maxUID":4},"positionComponentManagerState":{"maxIndex":4,"buffer":{},"positions":{"0":2,"1":2,"2":2,"3":0,"4":0,"5":0,"6":6,"7":6,"8":6,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0},"gameObjectMap":{"0":0,"1":1,"2":2,"3":3},"gameObjectPositionMap":{"0":0,"1":1,"2":2,"3":3}},"velocityComponentManagerState":{"maxIndex":4,"buffer":{},"velocitys":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1},"gameObjectMap":{"0":0,"1":1,"2":2,"3":3},"gameObjectVelocityMap":{"0":0,"1":1,"2":2,"3":3}},"flyComponentManagerState":{"maxIndex":1,"buffer":{},"maxVelocitys":{"0":10,"1":10,"2":10,"3":10,"4":10,"5":10,"6":10,"7":10,"8":10,"9":10},"gameObjectMap":{"0":2,"1":3},"gameObjectFlyMap":{"2":0,"3":1}},"instanceComponentManagerState":{"maxUID":1,"gameObjectMap":{"0":0,"1":1},"gameObjectInstanceMap":{"0":0,"1":1}}}
```

通过打印的数据，可以看到运行的步骤与之前一样
不同之处在于：
打印的worldState不一样


我们看下打印的worldState：
worldState的gameObjectManagetState的maxUID为4，说明创建了4个gameObject；
worldState的positionComponentManagerState的maxIndex为4，说明创建了4个positionComponent；
worldState的positionComponentManagerState的positions有3个连续的值是2、2、2，说明进行了一次move操作；有另外3个连续的值是6、6、6，说明进行了一次move操作和一次fly操作；


<!-- # 设计意图

阐明模式的设计目标 -->

# 定义

## 一句话定义？

组合代替继承，连续地保存组件数据，分离逻辑和数据



## 补充说明

“组合代替继承”是基于组件化思想
“连续地保存组件数据”是基于Data Oriented思想
“分离逻辑和数据”是指提出System、Manager、Component+GameObject这三层，其中System层实现行为逻辑，Manager层维护数据，Component+GameObject层的组件和GameObject只是一个扁平的number类型的索引或者id值


## 通用UML？
![image](https://img2023.cnblogs.com/blog/419321/202304/419321-20230407093915551-2129951086.png)

## 分析角色？

我们来看看模式的相关角色：

总体来看，分成四个层级：World、System层、Manager层、Component+GameObject层，它们的依赖关系为World依赖System层，System层依赖Manager层，Manager层依赖Component+GameObject层


System层负责实现行为的逻辑
Manager层负责管理场景数据，即管理GameObject和组件的数据
Component+GameObject层为组件和GameObject，它们现在只是有一个number类型的数据的值对象



我们看下World这一层：

- World
该角色是门户，提供了API，实现了初始化和主循环的逻辑



我们看下System这一层：

一个System实现一个行为的逻辑

- CreateStateSystem
该角色负责创建WorldState

- OtherSystem
该角色是除了CreateStateSystem以外其它的所有System


我们看下Manager这一层：

- GameObjectManager
该角色负责管理所有的gameObject

- DataOrientedComponentManager
该角色是一种Data Oriented组件的Manager，负责维护和管理该种组件的所有组件数据，将其集中地保存在各自的一块连续的地址空间（即ArrayBuffer）中


- OtherComponentManager
该角色是一种其它组件的Manager，负责维护和管理该种组件的所有组件数据，将其保存在Map中，每个Map保存一类数据


我们看下Component+GameObject这一层：

- DataOrientedComponent
该角色是一种Data Oriented组件，该种组件的每个组件都只是一个ArrayBuffer中的索引

- OtherComponent
该角色是一种其它组件，该种组件的每个组件都只是一个id

- GameObject
该角色是一个gameObject，它只是一个id




## 角色之间的关系？

- 只有一个CreateStateSystem

- 可以有多个OtherSystem，每个负责处理一个行为

- 只有一个GameObjectManager

- 可以有多个DataOrientedComponentManager，每个对应一种Data Oriented组件的Manager

- 可以有多个DataOrientedComponent，每个对应一种Data Oriented组件

- 可以有多个OtherComponentManager，每个Manager对应一种其它组件的Manager

- 可以有多个OtherComponent，每个对应一种其它组件

- DataOrientedComponentManager与DataOrientedComponent是一对一的依赖关系，OtherComponentManager与OtherComponent是一对一的依赖关系
意思是一种组件Manager管理一种组件

- 一个GameObject可以挂载多种组件，所以在图中GameObject与DataOrientedComponent、OtherComponent都是一对多的组合关系

- 一种组件的Manager只对该种组件进行操作，而一个System可以对多种组件进行操作，所以在图中System依赖了所有的Manager而不是一个Manager


## 角色的抽象代码？

下面我们来看看各个角色的抽象代码：


首先，我们看下用户的抽象代码；
然后，我们看下World的抽象代码
然后，我们看下CreateStateSystem的抽象代码
然后，我们看下OtherSystem的抽象代码
然后，我们看下GameObjectManager的抽象代码
然后，我们看下DataOrientedComponentManager的抽象代码
然后，我们看下OtherComponentManager的抽象代码
然后，我们看下GameObject的抽象代码
然后，我们看下DataOrientedComponent的抽象代码
最后，我们看下OtherComponent的抽象代码


- 用户的抽象代码
Client
```ts
    //创建gameObject1
    let gameObject1Data = WorldSceneAPI.createGameObject(worldState)
    worldState = gameObject1Data[0]
    let gameObject1 = gameObject1Data[1]

    //创建组件
    let dataOrientedComponent1Data = WorldSceneAPI.createDataOrientedComponent1(worldState)
    worldState = dataOrientedComponent1Data[0]
    let dataOrientedComponent1 = dataOrientedComponent1Data[1]
    let otherComponent1Data = WorldSceneAPI.createOtherComponent1(worldState)
    let otherComponent1 = otherComponent1Data[1]
    worldState = otherComponent1Data[0]

    //挂载组件
    worldState = WorldSceneAPI.setDataOrientedComponent1(worldState, gameObject1, dataOrientedComponent1)
    worldState = WorldSceneAPI.setOtherComponent1(worldState, gameObject1, otherComponent1)

    //触发gameObject1的行为
    worldState = World.action1(worldState, gameObject1, dataOrientedComponent1, otherComponent1)

    创建更多的GameObjects...

    return worldState


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
    调用OtherSystem来update

    调用OtherSystem来render

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

        创建更多的DataOrientedManagerState和OtherComponentManagerState...
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
    //buffer保存了该种组件所有的value1、value2、...、valueX数据
    buffer: ArrayBuffer,
    //该种组件所有的value1数据的视图
    value1s: TypeArrayType,
    //该种组件所有的value2数据的视图
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
    //value1Map用来保存该种组件所有的value1数据
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

ECS模式主要遵循下面的设计原则：

- 单一职责原则
每个System只实现一个行为
每个组件Manager只管理一种组件
- 合成复用原则
GameObject组合了多个Component
- 接口隔离原则
GameObject和Component经过了扁平化处理，移除了数据和逻辑，变为只是有一个number类型数据的值对象
- 最少知识原则
World、System、Manager、Component+GameObject这几个层只能上层依赖下层，不能跨层依赖
- 开闭原则
要增加一种行为，只需要增加一个System




# 应用

## 优点

- 组件的数据集中连续地保存在ArrayBuffer中，增加了缓存命中，提高了读写的性能

- 创建和删除组件的性能也很好，因为在这个过程中不会分配或者销毁内存，所以没有垃圾回收的开销
这是因为在创建ArrayBuffer时（也就是在创建WorldState时）就预先按照最大组件个数分配了一块连续的内存，所以在创建组件时，只是返回一个当前最大索引(maxIndex)加1的值而已；
在删除组件时，只是将该组件对应ArrayBuffer中的数据还原为默认值而已


- 职责划分明确，行为的逻辑应该放在哪里很清楚
对于只涉及到操作一种组件的行为逻辑（如batchUpdate position），则将其放在该组件对应的Manager（如PositionComponentManager）或者对应的System中（如UpdateSystem）；涉及到多种组件的行为逻辑则放在对应的System中（如FlySystem）；

- 增加行为很容易
因为一个行为对应一个System，所以要增加一个行为，则只需增加一个对应的System即可，这不会影响到Manager
另外，因为System只有逻辑没有数据，所以增加和维护System很容易


## 缺点

- 需要转换为函数式编程的思维
习惯面向对象编程的同学倾向于设计一个组件是一个包括数据和逻辑的类，而ECS模式则将其扁平化为一个值对象，也就是一个组件变成了一个数据，这更符合函数式编程中一切都是数据的思维模式
另外，ECS中的System其实就只是一个函数而已，本身没有数据，这也符合函数式编程中函数是第一公民的思维模式
所以，如果是使用函数式编程范式的同学能够更容易地使用ECS模式


<!-- - 实现起来比较复杂 -->

## 使用场景

### 场景描述

<!-- 有很多或者很复杂的行为的游戏或者应用 -->

适合于大型的游戏，场景中有很多人物，人物的行为很多或者很复杂


### 具体案例

- 有很多个种类的游戏人物的游戏

<!-- 将游戏人物改为组件化架构设计， -->
通过挂载不同的组件到GameObject来实现不同种类的游戏人物，代替继承

- 游戏人物有很多的行为，而且还经常会增加新的行为

将每个行为对应为一个System

增加新的行为就是增加一个System

不管行为如何变化，只影响System层，不会影响Manager层和GameObject、Component层


- 对于引擎而言，ECS模式主要用在场景管理这块



## 注意事项

- 因为组件的ArrayBuffer一旦在创建后，它的大小就不会改动，所以最好在创建时指定足够大的最大组件个数


<!-- # 扩展 -->


# 结合其它模式

## 结合多线程模式

如果引擎开了多个线程，那么可以将组件的ArrayBuffer改为SharedArrayBuffer。这样的话就可以将其直接共享到各个线程中，而不需要拷贝，从而提高了性能



## 结合管道模式

如果引擎使用了管道模式，那么可以去掉System，使用管道的Job来代替，其中一个Job就是一个System
另外，可以去掉WorldState，而使用PipelineManagerState来代替


<!-- 
## 使用场景是什么？
## UML如何变化？
## 代码如何变化？ -->




# 最佳实践

## 哪些场景不需要使用模式？

如果游戏的人物种类很少，行为简单，那么就可以使用最开始给出的继承方案，使用一个人物模块对应一种人物，这样最容易实现


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

ECS的概念最先是由“守望先锋”游戏的开发者提出的，详细资料可以搜索“《守望先锋》架构设计和网络同步”

ECS模式是在“组件化”、“Data Oriented”基础上发展而来，可以在网上搜索更多关于“组件化”、“Data Oriented”、“ECS”的资料

<!-- 很多游戏引擎都开始使用ECS的思想来设计架构 -->