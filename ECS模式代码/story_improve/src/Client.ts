import { init, loop } from "ecs_pattern_utils/src/World";
import * as UpdateSystem from "./system/UpdateSystem"
import * as RenderOneByOneSystem from "./system/RenderOneByOneSystem"
import * as RenderInstancesSystem from "./system/RenderInstancesSystem"
import { createFlyComponent, createGameObject, createInstanceComponent, createPositionComponent, createVelocityComponent, setFlyComponent, setInstanceComponent, setPositionComponent, setVelocityComponent } from "./world/SceneAPI";
import { createState, move, fly } from "./world/World";
import { state as worldState } from "./world/WorldStateType";

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



    let normalHero2Data = createGameObject(worldState)
    worldState = normalHero2Data[0]
    let normalHero2 = normalHero2Data[1]

    let positionComponent2Data = createPositionComponent(worldState)
    worldState = positionComponent2Data[0]
    let positionComponent2 = positionComponent2Data[1]
    let velocityComponent2Data = createVelocityComponent(worldState)
    let velocityComponent2 = velocityComponent2Data[1]
    worldState = velocityComponent2Data[0]
    let instanceComponent2Data = createInstanceComponent(worldState)
    let instanceComponent2 = instanceComponent2Data[1]
    worldState = velocityComponent2Data[0]

    worldState = setPositionComponent(worldState, normalHero2, positionComponent2)
    worldState = setVelocityComponent(worldState, normalHero2, velocityComponent2)
    worldState = setInstanceComponent(worldState, normalHero2, instanceComponent2)



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



    let superHero2Data = createGameObject(worldState)
    worldState = superHero2Data[0]
    let superHero2 = superHero2Data[1]

    let positionComponent4Data = createPositionComponent(worldState)
    worldState = positionComponent4Data[0]
    let positionComponent4 = positionComponent4Data[1]
    let velocityComponent4Data = createVelocityComponent(worldState)
    let velocityComponent4 = velocityComponent4Data[1]
    worldState = velocityComponent4Data[0]
    let flyComponent2Data = createFlyComponent(worldState)
    let flyComponent2 = flyComponent2Data[1]
    worldState = velocityComponent4Data[0]

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

loop(worldState, [UpdateSystem.update, RenderOneByOneSystem.render, RenderInstancesSystem.render])