import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils";
import { state as flyComponentState } from "./FlyComponentStateType"
import { getPositionComponentExn, getVelocityComponentExn } from "../gameObject/GameObject";
import { getGameObjectStateExn, setPositionComponentState } from "../utils/WorldUtils";
import { state as worldState } from "../world/WorldStateType";
import { getVelocity } from "./VelocityComponent";
import { getPosition, setPosition } from "./PositionComponent";

export let create = (): flyComponentState => {
    let flyComponentState: flyComponentState = {
        gameObject: null,
        maxVelocity: 2.0
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
    let maxVelocity = flyComponentState.maxVelocity

    let gameObject = getExnFromStrictNull(flyComponentState.gameObject)
    let gameObjectState = getGameObjectStateExn(worldState, gameObject)

    let [x, y, z] = getPosition(getPositionComponentExn(gameObjectState))

    let velocity = getVelocity(getVelocityComponentExn(gameObjectState))

    velocity = velocity < maxVelocity ? velocity : maxVelocity

    let positionComponentState = setPosition(getPositionComponentExn(gameObjectState), [x + velocity, y + velocity, z + velocity])

    return setPositionComponentState(worldState, gameObject, positionComponentState)
}