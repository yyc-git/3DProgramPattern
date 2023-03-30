import { state } from "./RenderStateType"
import { state as pipelineState } from "pipeline_manager/src/type/StateType"
import { createState as createPipelineManagerState, registerPipeline, runPipeline, init } from "pipeline_manager"
import { getPipeline as getRenderInPCPipeline } from "renderInPC_pipeline/src/Main"
import { getPipeline as getJiaRenderInMobilePipeline } from "jia_renderInMobile_pipeline/src/Main"
import { getPipeline as getYiRenderInMobilePipeline } from "yi_renderInMobile_pipeline/src/Main"
import { service as mostService } from "most/src/MostService"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { unsafeGetState, setState } from "./RenderStateContainer"

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

let _unsafeGetPipeManagerState = (state: state) => {
    return state.renderPipelineState
}

let _setPipeManagerState = (state: state, renderPipelineState: pipelineState) => {
    return {
        ...state,
        renderPipelineState: renderPipelineState
    }
}

let _runPipeline = (
    renderState: state,
    pipelineName: string
): Promise<state> => {
    let tempRenderState: state | null = null

    return mostService.map(
        (renderState: state) => {
            tempRenderState = renderState

            return renderState
        },
        runPipeline<state>(renderState, [
            unsafeGetState,
            setState,
            _unsafeGetPipeManagerState,
            _setPipeManagerState
        ], pipelineName)
    ).drain().then((_) => {
        return getExnFromStrictNull(tempRenderState)
    })
}

export let render = (state: state, canvas): Promise<state> => {
    state = init(state, [_unsafeGetPipeManagerState, _setPipeManagerState])

    globalThis.canvas = canvas

    return _runPipeline(state, "render")
}