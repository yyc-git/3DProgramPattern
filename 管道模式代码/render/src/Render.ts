import { state } from "./RenderStateType"
import { state as pipelineState } from "pipeline_manager/src/type/StateType"
import { createState as createPipelineManagerState, registerPipeline, runPipeline } from "pipeline_manager"
import { getPipeline as getRenderInPCPipeline } from "renderInPC_pipeline/src/Main"
import { getPipeline as getJiaRenderInMobilePipeline } from "jia_renderInMobile_pipeline/src/Main"
import { getPipeline as getYiRenderInMobilePipeline } from "yi_renderInMobile_pipeline/src/Main"
import { service as mostService } from "most/src/MostService"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

let _isPC = () => {
    console.log(globalThis.isPC ? "is PC" : "is mobile")

    return globalThis.isPC
}

export let createState = (): state => {
    return {
        renderPipelineState: createPipelineManagerState()
    }
}

export let registerAllPipelines = (state: state) => {
    if (_isPC()) {
        let renderPipelineState = registerPipeline(
            state.renderPipelineState,
            getRenderInPCPipeline(),
            []
        )

        state = {
            ...state,
            renderPipelineState: renderPipelineState
        }
    }
    else {
        let renderPipelineState = registerPipeline(
            state.renderPipelineState,
            getJiaRenderInMobilePipeline(),
            []
        )
        renderPipelineState = registerPipeline(
            renderPipelineState,
            getYiRenderInMobilePipeline(),
            [
                {
                    pipelineName: "render",
                    insertElementName: "init_webgl1_jia_renderInMobile",
                    insertAction: "after"
                }
            ]
        )

        state = {
            ...state,
            renderPipelineState: renderPipelineState
        }
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

export let render = (state: state, canvas) => {
    globalThis.canvas = canvas

    return _runPipeline(state.renderPipelineState, "render")
        .then((renderPipelineState) => {
            return {
                ...state,
                renderPipelineState: renderPipelineState
            }
        })
}