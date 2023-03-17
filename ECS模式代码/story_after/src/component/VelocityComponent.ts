import { state as velocityComponentState } from "./VelocityComponentStateType"

export let create = (): velocityComponentState => {
    let velocityComponentState: velocityComponentState = {
        gameObject: null,
        velocity: 1.0
    }

    return velocityComponentState
}

export let getVelocity = (velocityComponentState: velocityComponentState) => {
    return velocityComponentState.velocity
}