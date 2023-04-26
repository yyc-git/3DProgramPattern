import { state } from "./EngineStateType"
import { state as pipelineState } from "pipeline_manager/src/type/StateType"
import * as PipelineManager from "pipeline_manager"
import * as EngineInPCPipeline from "engineInPC_pipeline/src/Main"
import * as JiaEngineInMobilePipeline from "jia_engineInMobile_pipeline/src/Main"
import * as YiEngineInMobilePipeline from "yi_engineInMobile_pipeline/src/Main"
import { service as mostService } from "most/src/MostService"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { unsafeGetState, setState } from "./EngineStateContainer"

let _isPC = () => {
    console.log(globalThis.isPC ? "is PC" : "is mobile")

    return globalThis.isPC
}

export let createState = (): state => {
    return {
        pipelineManagerState: PipelineManager.createState()
    }
}

export let registerAllPipelines = (state: state) => {
    if (_isPC()) {
        let pipelineManagerState = PipelineManager.registerPipeline(
            state.pipelineManagerState,
            EngineInPCPipeline.getPipeline(),
            []
        )

        state = {
            ...state,
            pipelineManagerState: pipelineManagerState
        }
    }
    else {
        let pipelineManagerState = PipelineManager.registerPipeline(
            state.pipelineManagerState,
            JiaEngineInMobilePipeline.getPipeline(),
            []
        )
        pipelineManagerState = PipelineManager.registerPipeline(
            pipelineManagerState,
            YiEngineInMobilePipeline.getPipeline(),
            [
                {
                    pipelineName: "render",
                    insertElementName: "forward_render_jia_engineInMobile",
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

//从EngineState中获得PipelineManagerState
let _unsafeGetPipelineManagerState = (state: state) => {
    return state.pipelineManagerState
}

//保存PipelineManagerState到EngineState中
let _setPipelineManagerState = (state: state, pipelineManagerState: pipelineState) => {
    return {
        ...state,
        pipelineManagerState: pipelineManagerState
    }
}

let _runPipeline = (
    engineState: state,
    pipelineName: string
): Promise<state> => {
    let tempEngineState: state | null = null

    return mostService.map(
        (engineState: state) => {
            tempEngineState = engineState

            return engineState
        },
        //调用PipelineManager的runPipeline函数来运行管道
        PipelineManager.runPipeline<state>(engineState, [
            unsafeGetState,
            setState,
            _unsafeGetPipelineManagerState,
            _setPipelineManagerState
        ], pipelineName)
    ).drain().then((_) => {
        return getExnFromStrictNull(tempEngineState)
    })
}

export let init = (state: state, canvas): Promise<state> => {
    //调用PipelineManager的init函数来初始化PipelineManager
    state = PipelineManager.init(state, [_unsafeGetPipelineManagerState, _setPipelineManagerState])

    //将canvas保存到全局变量中，从而在Job中通过全局变量能够获得canvas
    globalThis.canvas = canvas

    //运行Init Pipeline管道
    return _runPipeline(state, "init")
}

export let render = (state: state): Promise<state> => {
    //运行Render Pipeline管道
    return _runPipeline(state, "render")
}