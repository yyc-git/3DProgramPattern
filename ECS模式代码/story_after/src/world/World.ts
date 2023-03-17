import { Map } from "immutable"
import { update as updatePositionComponent } from "../component/PositionComponent";
import { update as updateVelocityComponent } from "../component/VelocityComponent";
import { update as updateFlyComponent } from "../component/FlyComponent";
import { update as updateInstanceComponent } from "../component/InstanceComponent";
import { getFlyComponentExn, getInstanceComponentExn, getPositionComponentExn, getVelocityComponentExn, hasFlyComponent, hasInstanceComponent, hasPositionComponent, hasVelocityComponent } from "../gameObject/GameObject";
import { state as worldState } from "./WorldStateType";

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
            if (hasVelocityComponent(gameObjectState)) {
                gameObjectState = {
                    ...gameObjectState,
                    velocityComponent: updateVelocityComponent(getVelocityComponentExn(gameObjectState))
                }
            }
            if (hasFlyComponent(gameObjectState)) {
                gameObjectState = {
                    ...gameObjectState,
                    flyComponent: updateFlyComponent(getFlyComponentExn(gameObjectState))
                }
            }
            if (hasInstanceComponent(gameObjectState)) {
                gameObjectState = {
                    ...gameObjectState,
                    instanceComponent: updateInstanceComponent(getInstanceComponentExn(gameObjectState))
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
