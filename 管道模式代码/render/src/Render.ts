import { state } from "./RenderStateType"
import { state as renderPipelineState } from "pipeline_manager/src/type/StateType"
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

export let init = (state: state) => {
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
    state: state,
    pipelineName: string
): Promise<state> => {
    let tempPipelineState: renderPipelineState | null = null

    return mostService.map(
        (renderPipelineState: renderPipelineState) => {
            tempPipelineState = renderPipelineState

            return renderPipelineState
        },
        runPipeline(state.renderPipelineState, pipelineName)
    ).drain().then((_) => {
        return {
            ...state,
            renderPipelineState: getExnFromStrictNull(tempPipelineState)
        }
    })
}

export let render = (state: state, canvas) => {
    globalThis.canvas = canvas

    return _runPipeline(state, "render")
}