import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils";
import { state as positionComponentState } from "../component/PositionComponentStateType"
import * as GameObject from "../gameObject/GameObject";
import { getGameObjectStateExn, setPositionComponentState } from "../utils/WorldUtils";
import { state as worldState } from "../world/WorldStateType";
import * as VelocityComponent from "./VelocityComponent";

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

export let move = (worldState: worldState, positionComponentState: positionComponentState): worldState => {
    //获得该组件的position、gameObject
    let [x, y, z] = getPosition(positionComponentState)

    //通过该组件的gameObject，获得挂载到该gameObject的velocityComponent组件
    //获得它的velocity
    let gameObject = getExnFromStrictNull(positionComponentState.gameObject)
    let velocity = VelocityComponent.getVelocity(GameObject.getVelocityComponentExn(getGameObjectStateExn(worldState, gameObject)))

    //根据velocity，更新该组件的position
    positionComponentState = setPosition(positionComponentState, [x + velocity, y + velocity, z + velocity])

    return setPositionComponentState(worldState, gameObject, positionComponentState)
}