import { create as createPositionComponent, move } from "./component/PositionComponent";
import { create as createVelocityComponent } from "./component/VelocityComponent";
import { create as createFlyComponent, fly } from "./component/FlyComponent";
import { create as createInstanceComponent } from "./component/InstanceComponent";
import { create as createGameObject, setPositionComponent, setFlyComponent, setVelocityComponent, setInstanceComponent, getPositionComponentExn, getFlyComponentExn } from "./gameObject/GameObject";
import { addGameObject, createState, init, loop } from "./world/World";
import { state as worldState } from "./world/WorldStateType";
import { getGameObjectStateExn } from "./utils/WorldUtils";

let _createScene = (worldState: worldState): worldState => {
    let normalHeroData1 = createGameObject()
    let normalHero1State = normalHeroData1[0]
    let normalHero1 = normalHeroData1[1]

    let positionComponent1 = createPositionComponent()
    let velocityComponent1 = createVelocityComponent()
    let instanceComponent1 = createInstanceComponent()

    normalHero1State = setPositionComponent(normalHero1State, normalHero1, positionComponent1)
    normalHero1State = setVelocityComponent(normalHero1State, normalHero1, velocityComponent1)
    normalHero1State = setInstanceComponent(normalHero1State, normalHero1, instanceComponent1)

    worldState = addGameObject(worldState, [normalHero1State, normalHero1])


    let normalHeroData2 = createGameObject()
    let normalHero2State = normalHeroData2[0]
    let normalHero2 = normalHeroData2[1]

    let positionComponent2 = createPositionComponent()
    let velocityComponent2 = createVelocityComponent()
    let instanceComponent2 = createInstanceComponent()

    normalHero2State = setPositionComponent(normalHero2State, normalHero2, positionComponent2)
    normalHero2State = setVelocityComponent(normalHero2State, normalHero2, velocityComponent2)
    normalHero2State = setInstanceComponent(normalHero2State, normalHero2, instanceComponent2)

    worldState = addGameObject(worldState, [normalHero2State, normalHero2])


    worldState = move(worldState, getPositionComponentExn(
        getGameObjectStateExn(worldState, normalHero1)
    ))



    let superHeroData1 = createGameObject()
    let superHero1State = superHeroData1[0]
    let superHero1 = superHeroData1[1]

    let positionComponent3 = createPositionComponent()
    let velocityComponent3 = createVelocityComponent()
    let flyComponent1 = createFlyComponent()

    superHero1State = setPositionComponent(superHero1State, superHero1, positionComponent3)
    superHero1State = setVelocityComponent(superHero1State, superHero1, velocityComponent3)
    superHero1State = setFlyComponent(superHero1State, superHero1, flyComponent1)

    worldState = addGameObject(worldState, [superHero1State, superHero1])


    let superHeroData2 = createGameObject()
    let superHero2State = superHeroData2[0]
    let superHero2 = superHeroData2[1]

    let positionComponent4 = createPositionComponent()
    let velocityComponent4 = createVelocityComponent()
    let flyComponent2 = createFlyComponent()

    superHero2State = setPositionComponent(superHero2State, superHero2, positionComponent4)
    superHero2State = setVelocityComponent(superHero2State, superHero2, velocityComponent4)
    superHero2State = setFlyComponent(superHero2State, superHero2, flyComponent2)

    worldState = addGameObject(worldState, [superHero2State, superHero2])


    worldState = move(worldState, getPositionComponentExn(
        getGameObjectStateExn(worldState, superHero1)
    ))
    worldState = fly(worldState, getFlyComponentExn(
        getGameObjectStateExn(worldState, superHero1)
    ))



    return worldState
}

let worldState = createState()

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState)