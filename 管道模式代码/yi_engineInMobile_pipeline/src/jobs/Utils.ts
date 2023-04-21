import { state, states, pipelineName } from "yi_engineInMobile_pipeline_state_type/src/StateType"
import { pipelineName as jiaEngineInMobilePipelineName } from "jia_engineInMobile_pipeline_state_type/src/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export function getState(states: states): state {
    //pipelineName来自YiEngineInMobilePipelineStateType
    return states[pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        //pipelineName来自YiEngineInMobilePipelineStateType
        [pipelineName]: state
    })
}

//获得JiaEngineInMobilePipelineState的gl
export function getGL(states: states) {
    //jiaEngineInMobilePipelineName来自JiaEngineInMobilePipelineStateType
    return getExnFromStrictNull(states[jiaEngineInMobilePipelineName].gl)
}