import { state, states, pipelineName } from "pipeline1_state_type_abstract/src/StateType"
import { pipelineName as xxxPipelineName } from "依赖的其它管道_state_type_abstarct/src/StateType"

export function getState(states: states): state {
    return states[pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        [pipelineName]: state
    })
}

export function 获得依赖的其它管道的数据(states: states) {
    return states[xxxPipelineName].xxx
}