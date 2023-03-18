import { createFlyComponent, createGameObject, createInstanceComponent, createPositionComponent, createVelocityComponent, setFlyComponent, setInstanceComponent, setPositionComponent, setVelocityComponent } from "./world/SceneAPI";
import { createState, init, loop, move, fly } from "./world/World";
import { state as worldState } from "./world/WorldStateType";

let _createScene = (worldState: worldState): worldState => {
    let normalHeroData1 = createGameObject(worldState)
    worldState = normalHeroData1[0]
    let normalHero1 = normalHeroData1[1]

    let positionComponentData1 = createPositionComponent(worldState)
    worldState = positionComponentData1[0]
    let positionComponent1 = positionComponentData1[1]
    let velocityComponentData1 = createVelocityComponent(worldState)
    let velocityComponent1 = velocityComponentData1[1]
    worldState = velocityComponentData1[0]
    let instanceComponentData1 = createInstanceComponent(worldState)
    let instanceComponent1 = instanceComponentData1[1]
    worldState = velocityComponentData1[0]

    worldState = setPositionComponent(worldState, normalHero1, positionComponent1)
    worldState = setVelocityComponent(worldState, normalHero1, velocityComponent1)
    worldState = setInstanceComponent(worldState, normalHero1, instanceComponent1)



    let normalHeroData2 = createGameObject(worldState)
    worldState = normalHeroData2[0]
    let normalHero2 = normalHeroData2[1]

    let positionComponentData2 = createPositionComponent(worldState)
    worldState = positionComponentData2[0]
    let positionComponent2 = positionComponentData2[1]
    let velocityComponentData2 = createVelocityComponent(worldState)
    let velocityComponent2 = velocityComponentData2[1]
    worldState = velocityComponentData2[0]
    let instanceComponentData2 = createInstanceComponent(worldState)
    let instanceComponent2 = instanceComponentData2[1]
    worldState = velocityComponentData2[0]

    worldState = setPositionComponent(worldState, normalHero2, positionComponent2)
    worldState = setVelocityComponent(worldState, normalHero2, velocityComponent2)
    worldState = setInstanceComponent(worldState, normalHero2, instanceComponent2)



    worldState = move(worldState, positionComponent1, velocityComponent1)



    let superHeroData1 = createGameObject(worldState)
    worldState = superHeroData1[0]
    let superHero1 = superHeroData1[1]

    let positionComponentData3 = createPositionComponent(worldState)
    worldState = positionComponentData3[0]
    let positionComponent3 = positionComponentData3[1]
    let velocityComponentData3 = createVelocityComponent(worldState)
    let velocityComponent3 = velocityComponentData3[1]
    worldState = velocityComponentData3[0]
    let flyComponentData1 = createFlyComponent(worldState)
    let flyComponent1 = flyComponentData1[1]
    worldState = velocityComponentData3[0]

    worldState = setPositionComponent(worldState, superHero1, positionComponent3)
    worldState = setVelocityComponent(worldState, superHero1, velocityComponent3)
    worldState = setFlyComponent(worldState, superHero1, flyComponent1)



    let superHeroData2 = createGameObject(worldState)
    worldState = superHeroData2[0]
    let superHero2 = superHeroData2[1]

    let positionComponentData4 = createPositionComponent(worldState)
    worldState = positionComponentData4[0]
    let positionComponent4 = positionComponentData4[1]
    let velocityComponentData4 = createVelocityComponent(worldState)
    let velocityComponent4 = velocityComponentData4[1]
    worldState = velocityComponentData4[0]
    let flyComponentData2 = createFlyComponent(worldState)
    let flyComponent2 = flyComponentData2[1]
    worldState = velocityComponentData4[0]

    worldState = setPositionComponent(worldState, superHero2, positionComponent4)
    worldState = setVelocityComponent(worldState, superHero2, velocityComponent4)
    worldState = setFlyComponent(worldState, superHero2, flyComponent2)



    worldState = move(worldState, positionComponent3, velocityComponent3)

    worldState = fly(worldState, positionComponent3, velocityComponent3, flyComponent1)



    return worldState
}

let worldState = createState({ positionComponentCount: 10, velocityComponentCount: 10, flyComponentCount: 10 })

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState)