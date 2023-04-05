import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils";
import { state as positionComponentState } from "../component/PositionComponentStateType"
import { getVelocityComponentExn } from "../gameObject/GameObject";
import { getGameObjectStateExn, setPositionComponentState } from "../utils/WorldUtils";
import { state as worldState } from "../world/WorldStateType";
import { getVelocity } from "./VelocityComponent";

export let create = (): positionComponentState => {
    let positionComponentState: positionComponentState = {
        gameObject: null,
        position: [0, 0, 0],
    }

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
    let [x, y, z] = positionComponentState.position

    let gameObject = getExnFromStrictNull(positionComponentState.gameObject)

    let velocity = getVelocity(getVelocityComponentExn(getGameObjectStateExn(worldState, gameObject)))

    positionComponentState = setPosition(positionComponentState, [x + velocity, y + velocity, z + velocity])

    return setPositionComponentState(worldState, gameObject, positionComponentState)
}