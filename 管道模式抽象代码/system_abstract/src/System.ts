import { state } from "./SystemStateType"
import { state as pipelineState } from "pipeline_manager_abstract/src/type/StateType"
import { createState as createPipelineManagerState, registerPipeline, runPipeline } from "pipeline_manager_abstract"
import { getPipeline as getPipeline1 } from "pipeline1_abstract/src/Main"
import { service as mostService } from "most/src/MostService"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

declare function _isEnvironment1(): boolean

export let createState = (): state => {
    return {
        pipeline1State: createPipelineManagerState(),
        更多Pipeline的State: createPipelineManagerState()...
    }
}

export let registerAllPipelines = (state: state) => {
    if (_isEnvironment1()) {
        let pipeline1State = registerPipeline(
            state.pipeline1State,
            getPipeline1(),
            []
        )

        if (需要合并属于Pipeline1的子管道) {
            pipeline1State = registerPipeline(
                pipeline1State,
                getPipeline1SubPipeline1(),
                [
                    {
                        pipelineName: 管道1的名称,
                        insertElementName: 插入的目标Element的JSON名称,
                        insertAction: "before" or "after" 
                    }
                ]
            )
        }

        注册更多的PipelineX...

        state = {
            ...state,
            pipeline1State: pipeline1State,
            pipelineXState: pipelineX...
        }
    }
    else {
        注册对应的Pipelines...
    }

    return state
}

let _runPipeline = (
    pipelineState: pipelineState,
    pipelineName: string
): Promise<pipelineState> => {
    let tempPipelineState: pipelineState | null = null

    return mostService.map(
        (pipelineState: pipelineState) => {
            tempPipelineState = pipelineState

            return pipelineState
        },
        runPipeline(pipelineState, pipelineName)
    ).drain().then((_) => {
        return getExnFromStrictNull(tempPipelineState)
    })
}

export let runPipeline1 = (state: state) => {
    return _runPipeline(state.pipeline1State, 管道1的名称)
        .then((pipeline1State) => {
            return {
                ...state,
                pipeline1State: pipeline1State
            }
        })
}

更多的runPipelineX...