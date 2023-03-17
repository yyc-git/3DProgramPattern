import { gameObject, state as gameObjectState } from "../gameObject/GameObjectStateType";
import { state as positionComponentState } from "../component/PositionComponentStateType"
import { state as flyComponentState } from "../component/FlyComponentStateType"
import { state as worldState } from "../world/WorldStateType";
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"
import { setPositionComponent, setFlyComponent } from "../gameObject/GameObject";

export let getGameObjectStateExn = (worldState: worldState, gameObject: gameObject): gameObjectState => {
    return getExnFromStrictUndefined(worldState.gameObjects.get(gameObject))
}

export let setPositionComponentState = (worldState: worldState, gameObject: gameObject, positionComponentState: positionComponentState): worldState => {
    return {
        ...worldState,
        gameObjects: worldState.gameObjects.set(gameObject,
            setPositionComponent(
                getGameObjectStateExn(worldState, gameObject),
                gameObject,
                positionComponentState
            )
        )
    }
}

export let setFlyComponentState = (worldState: worldState, gameObject: gameObject, flyComponentState: flyComponentState): worldState => {
    return {
        ...worldState,
        gameObjects: worldState.gameObjects.set(gameObject,
            setFlyComponent(
                getGameObjectStateExn(worldState, gameObject),
                gameObject,
                flyComponentState
            )
        )
    }
}