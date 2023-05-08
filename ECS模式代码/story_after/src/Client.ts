import * as WorldUtils from "ecs_pattern_utils/src/World";
import * as World from "./world/World";
import { state as worldState } from "./world/WorldStateType";

let _createScene = (worldState: worldState): worldState => {
    let normalHero1Data = World.api.gameObject.create()
    let normalHero1State = normalHero1Data[0]
    let normalHero1 = normalHero1Data[1]

    let positionComponent1 = World.api.positionComponent.create()
    let velocityComponent1 = World.api.velocityComponent.create()
    let instanceComponent1 = World.api.instanceComponent.create()

    normalHero1State = World.api.gameObject.setPositionComponent(normalHero1State, normalHero1, positionComponent1)
    normalHero1State = World.api.gameObject.setVelocityComponent(normalHero1State, normalHero1, velocityComponent1)
    normalHero1State = World.api.gameObject.setInstanceComponent(normalHero1State, normalHero1, instanceComponent1)

    worldState = World.addGameObject(worldState, [normalHero1State, normalHero1])


    let normalHero2Data = World.api.gameObject.create()
    let normalHero2State = normalHero2Data[0]
    let normalHero2 = normalHero2Data[1]

    let positionComponent2 = World.api.positionComponent.create()
    let velocityComponent2 = World.api.velocityComponent.create()
    let instanceComponent2 = World.api.instanceComponent.create()

    normalHero2State = World.api.gameObject.setPositionComponent(normalHero2State, normalHero2, positionComponent2)
    normalHero2State = World.api.gameObject.setVelocityComponent(normalHero2State, normalHero2, velocityComponent2)
    normalHero2State = World.api.gameObject.setInstanceComponent(normalHero2State, normalHero2, instanceComponent2)

    worldState = World.addGameObject(worldState, [normalHero2State, normalHero2])


    worldState = World.api.positionComponent.move(worldState, normalHero1)



    let superHero1Data = World.api.gameObject.create()
    let superHero1State = superHero1Data[0]
    let superHero1 = superHero1Data[1]

    let positionComponent3 = World.api.positionComponent.create()
    let velocityComponent3 = World.api.velocityComponent.create()
    let flyComponent1 = World.api.flyComponent.create()

    superHero1State = World.api.gameObject.setPositionComponent(superHero1State, superHero1, positionComponent3)
    superHero1State = World.api.gameObject.setVelocityComponent(superHero1State, superHero1, velocityComponent3)
    superHero1State = World.api.gameObject.setFlyComponent(superHero1State, superHero1, flyComponent1)

    worldState = World.addGameObject(worldState, [superHero1State, superHero1])


    let superHero2Data = World.api.gameObject.create()
    let superHero2State = superHero2Data[0]
    let superHero2 = superHero2Data[1]

    let positionComponent4 = World.api.positionComponent.create()
    let velocityComponent4 = World.api.velocityComponent.create()
    let flyComponent2 = World.api.flyComponent.create()

    superHero2State = World.api.gameObject.setPositionComponent(superHero2State, superHero2, positionComponent4)
    superHero2State = World.api.gameObject.setVelocityComponent(superHero2State, superHero2, velocityComponent4)
    superHero2State = World.api.gameObject.setFlyComponent(superHero2State, superHero2, flyComponent2)

    worldState = World.addGameObject(worldState, [superHero2State, superHero2])


    worldState = World.api.positionComponent.move(worldState, superHero1)
    worldState = World.api.flyComponent.fly(worldState, superHero1)



    return worldState
}

let worldState = World.createState()

worldState = _createScene(worldState)

worldState = WorldUtils.init(worldState)

WorldUtils.loop(worldState, [World.update, World.renderOneByOne, World.renderInstances])