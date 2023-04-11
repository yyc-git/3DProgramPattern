import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { state } from "./SystemStateType"

type stateContainer = { state: state | null }

let stateContainer: stateContainer = {
    state: null,
}

export let setState = (state: state) => {
    stateContainer.state = state
}

export let unsafeGetState = () => {
    return getExnFromStrictNull(stateContainer.state)
}
