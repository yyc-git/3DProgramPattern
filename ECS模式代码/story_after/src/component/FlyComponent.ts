import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils";
import { state as flyComponentState } from "./FlyComponentStateType"
import * as GameObject from "../gameObject/GameObject";
import { getGameObjectStateExn, setPositionComponentState } from "../utils/WorldUtils";
import { state as worldState } from "../world/WorldStateType";
import * as VelocityComponent from "./VelocityComponent";
import * as PositionComponent from "./PositionComponent";

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

    return setPositionComponentState(worldState, gameObject, positionComponentState)
}