import { gameObject, state as gameObjectState } from "./GameObjectStateType";
import { state as positionComponentState } from "../component/PositionComponentStateType"
import { state as velocityComponentState } from "../component/VelocityComponentStateType"
import { state as flyComponentState } from "../component/FlyComponentStateType"
import { state as instanceComponentState } from "../component/InstanceComponentStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { generateId } from "../utils/IdUtils";

export let create = (): [gameObjectState, gameObject] => {
    let gameObjectState: gameObjectState = {
        positionComponent: null,
        velocityComponent: null,
        flyComponent: null,
        instanceComponent: null
    }

    let id = generateId()

    return [
        gameObjectState,
        id
    ]
}

/*
值得注意的是：
getPositionComponentExn函数的函数名以“Exn”结尾，它是“Exception”的缩写，表明如果该函数返回的值为空，则报错
*/
export let getPositionComponentExn = ({ positionComponent }: gameObjectState): positionComponentState => {
    return getExnFromStrictNull(positionComponent)
}

export let getVelocityComponentExn = ({ velocityComponent }: gameObjectState): velocityComponentState => {
    return getExnFromStrictNull(velocityComponent)
}

export let getFlyComponentExn = ({ flyComponent }: gameObjectState): flyComponentState => {
    return getExnFromStrictNull(flyComponent)
}

export let getInstanceComponentExn = ({ instanceComponent }: gameObjectState): instanceComponentState => {
    return getExnFromStrictNull(instanceComponent)
}

export let setPositionComponent = (gameObjectState: gameObjectState, gameObject: gameObject, positionComponentState): gameObjectState => {
    return {
        ...gameObjectState,
        positionComponent: {
            ...positionComponentState,
            gameObject: gameObject
        }
    }
}

export let setVelocityComponent = (gameObjectState: gameObjectState, gameObject: gameObject, velocityComponentState): gameObjectState => {
    return {
        ...gameObjectState,
        velocityComponent: {
            ...velocityComponentState,
            gameObject: gameObject
        }
    }
}

export let setFlyComponent = (gameObjectState: gameObjectState, gameObject: gameObject, flyComponentState): gameObjectState => {
    return {
        ...gameObjectState,
        flyComponent: {
            ...flyComponentState,
            gameObject: gameObject
        }
    }
}

export let setInstanceComponent = (gameObjectState: gameObjectState, gameObject: gameObject, instanceComponentState): gameObjectState => {
    return {
        ...gameObjectState,
        instanceComponent: {
            ...instanceComponentState,
            gameObject: gameObject
        }
    }
}

export let hasPositionComponent = ({ positionComponent }: gameObjectState): boolean => {
    return positionComponent !== null
}

export let hasVelocityComponent = ({ velocityComponent }: gameObjectState): boolean => {
    return velocityComponent !== null
}

export let hasFlyComponent = ({ flyComponent }: gameObjectState): boolean => {
    return flyComponent !== null
}

export let hasInstanceComponent = ({ instanceComponent }: gameObjectState): boolean => {
    return instanceComponent !== null
}