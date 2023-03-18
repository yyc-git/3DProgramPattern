import { range } from "commonlib-ts/src/ArrayUtils";
import { gameObject } from "../../gameObject/GameObjectType";
import { state } from "./ManagerStateType";

export let createState = (): state => {
    return {
        maxUID: 0
    }
}

export let createGameObject = (state: state): [state, gameObject] => {
    let uid = state.maxUID

    let newUID = uid + 1

    state = {
        ...state,
        maxUID: newUID
    }

    return [state, uid]
}

export let getAllGameObjects = (state: state): Array<gameObject> => {
    let { maxUID } = state

    return range(0, maxUID - 1)
}