import { state, states, pipelineName } from "worker_pipeline_state_type_abstract/src/x_worker/StateType"

export function getState(states: states): state {
    return states[pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        [pipelineName]: state
    })
}