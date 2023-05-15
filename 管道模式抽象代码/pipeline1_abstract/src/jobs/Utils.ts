import * as Pipeline1StateType  from "pipeline1_state_type_abstract/src/StateType"
import * as 依赖的其它PipelineStateType  from "依赖的其它PipelineState_type_abstarct/src/StateType"

export function getState(states: states): state {
    return states[Pipeline1StateType.pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        [Pipeline1StateType.pipelineName]: state
    })
}

export function 获得依赖的其它PipelineState(states: states): 其它PipelineStateType.state {
    return states[依赖的其它PipelineStateType.pipelineName]
}

export function 设置依赖的其它PipelineState(states: states, state: 其它PipelineStateType.state): states {
    return Object.assign({}, states, {
        [依赖的其它PipelineStateType.pipelineName]: state
    })
}

export function 获得依赖的其它PipelineState的数据(states: states) {
    return 获得依赖的其它PipelineState(states).xxx
}