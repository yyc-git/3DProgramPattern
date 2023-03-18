import { Map } from "immutable"
import { update as updatePositionComponent } from "../component/PositionComponent";
// import { getPositionComponentExn, hasInstanceComponent, hasPositionComponent } from "../gameObject/GameObject";
import { state as worldState } from "./WorldStateType";
import { create as createPositionComponent, move } from "../component/PositionComponent";
import { create as createVelocityComponent } from "../component/VelocityComponent";
import { create as createFlyComponent, fly } from "../component/FlyComponent";
import { create as createInstanceComponent } from "../component/InstanceComponent";
import { create as createGameObject, setPositionComponent, setFlyComponent, setVelocityComponent, setInstanceComponent, getPositionComponentExn, getFlyComponentExn, hasPositionComponent, hasInstanceComponent } from "../gameObject/GameObject";
import { getGameObjectStateExn } from "../utils/WorldUtils";

export let createState = (): worldState => {
    return {
        gameObjects: Map()
    }
}

export let addGameObject = (worldState: worldState, [gameObjectState, gameObject]): worldState => {
    return {
        ...worldState,
        gameObjects: worldState.gameObjects.set(gameObject, gameObjectState)
    }
}

let _update = (worldState: worldState): worldState => {
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

let _renderOneByOne = (worldState: worldState): void => {
    let superHeroGameObjects = worldState.gameObjects.filter(gameObjectState => {
        return !hasInstanceComponent(gameObjectState)
    })

    superHeroGameObjects.forEach(gameObjectState => {
        console.log("OneByOne渲染 SuperHero...")
    })
}

let _renderInstances = (worldState: worldState): void => {
    let normalHeroGameObejcts = worldState.gameObjects.filter(gameObjectState => {
        return hasInstanceComponent(gameObjectState)
    })

    console.log("批量Instance渲染 NormalHeros...")
}

export let init = (worldState: worldState): worldState => {
    console.log("初始化...")

    return worldState
}


//假实现
let requestAnimationFrame = (func) => {
}


export let loop = (worldState: worldState) => {
    worldState = _update(worldState)
    _renderOneByOne(worldState)
    _renderInstances(worldState)

    // console.log(JSON.stringify(worldState))

    requestAnimationFrame(
        (time) => {
            loop(worldState)
        }
    )
}

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
    },
}