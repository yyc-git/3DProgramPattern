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
        pipelineManagerState: createPipelineManagerState()
    }
}

export let registerAllPipelines = (state: state) => {
    if (_isPC()) {
        let pipelineManagerState = registerPipeline(
            state.pipelineManagerState,
            getRenderInPCPipeline(),
            []
        )

        state = {
            ...state,
            pipelineManagerState: pipelineManagerState
        }
    }
    else {
        let pipelineManagerState = registerPipeline(
            state.pipelineManagerState,
            getJiaRenderInMobilePipeline(),
            []
        )
        pipelineManagerState = registerPipeline(
            pipelineManagerState,
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
            pipelineManagerState: pipelineManagerState
        }
    }

    return state
}

//从RenderState中获得PipelineManagerState
let _unsafeGetPipelineManagerState = (state: state) => {
    return state.pipelineManagerState
}

//保存PipelineManagerState到RenderState中
let _setPipelineManagerState = (state: state, pipelineManagerState: pipelineState) => {
    return {
        ...state,
        pipelineManagerState: pipelineManagerState
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
        //调用PipelineManager的runPipeline函数来运行管道
        runPipeline<state>(renderState, [
            unsafeGetState,
            setState,
            _unsafeGetPipelineManagerState,
            _setPipelineManagerState
        ], pipelineName)
    ).drain().then((_) => {
        return getExnFromStrictNull(tempRenderState)
    })
}

export let render = (state: state, canvas): Promise<state> => {
    //调用PipelineManager的init函数来初始化PipelineManager
    state = init(state, [_unsafeGetPipelineManagerState, _setPipelineManagerState])

    //将canvas保存到全局变量中，从而在Job中通过全局变量能够获得canvas
    globalThis.canvas = canvas

    //运行Render Pipeline管道
    return _runPipeline(state, "render")
}