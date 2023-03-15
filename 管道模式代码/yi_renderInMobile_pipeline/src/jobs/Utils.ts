import { state, states, pipelineName } from "yi_renderInMobile_pipeline_state_type/src/StateType"
import { pipelineName as jiaRenderInMobilePipelineName } from "jia_renderInMobile_pipeline_state_type/src/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export function getState(states: states): state {
    return states[pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        [pipelineName]: state
    })
}

export function getGL(states: states) {
    return getExnFromStrictNull(states[jiaRenderInMobilePipelineName].gl)
}