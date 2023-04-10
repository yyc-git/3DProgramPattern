import { state, states, pipelineName } from "yi_renderInMobile_pipeline_state_type/src/StateType"
import { pipelineName as jiaRenderInMobilePipelineName } from "jia_renderInMobile_pipeline_state_type/src/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export function getState(states: states): state {
    //pipelineName来自YiRenderInMobilePipelineStateType
    return states[pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        //pipelineName来自YiRenderInMobilePipelineStateType
        [pipelineName]: state
    })
}

//获得JiaRenderInMobilePipelineState的gl
export function getGL(states: states) {
    //jiaRenderInMobilePipelineName来自JiaRenderInMobilePipelineStateType
    return getExnFromStrictNull(states[jiaRenderInMobilePipelineName].gl)
}