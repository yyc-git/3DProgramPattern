import { state } from "./SystemStateType"
import { state as pipelineState } from "pipeline_manager_abstract/src/type/StateType"
import * as PipelineManager from "pipeline_manager_abstract"
import * as Pipeline1 from "pipeline1_abstract/src/Main"
import { service as mostService } from "most/src/MostService"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { unsafeGetState, setState } from "./SystemStateContainer"

declare function _isEnvironment1(): boolean

export let createState = (): state => {
    return {
        pipelineManagerState: PipelineManager.createState()
    }
}

export let registerAllPipelines = (state: state) => {
    if (_isEnvironment1()) {
        let pipelineManagerState = PipelineManager.registerPipeline(
            state.pipelineManagerState,
            Pipeline1.getPipeline(),
            []
        )

        pipelineManagerState = PipelineManager.registerPipeline(
            pipelineManagerState,
            Pipeline2.getPipeline(),
            if (需要合并Pipeline2和Pipeline1的某个X Pipeline管道) {
                [
                    {
                        pipelineName: 某个X Pipeline名,
                        insertElementName: 插入到的Element名,
                        insertAction: "before" or "after" 
                    },
                    指定其它的X Pipeline的合并...
                ]
            }
            else{
                []
            }
        )

        注册更多的Pipeline...

        state = {
            ...state,
            pipelineManagerState: pipelineManagerState
        }
    }
    else {
        注册其它Environment的Pipeline...
    }

    return state
}

let _unsafeGetPipelineManagerState = (state: state) => {
    return state.pipelineManagerState
}

let _setPipelineManagerState = (state: state, pipelineManagerState: pipelineState) => {
    return {
        ...state,
        pipelineManagerState: pipelineManagerState
    }
}

let _runPipeline = (
    state: state,
    pipelineName: string
): Promise<state> => {
    let tempSystemState: state | null = null

    return mostService.map(
        (state: state) => {
            tempSystemState = state

            return state
        },
        PipelineManager.runPipeline<state>(state, [
            unsafeGetState,
            setState,
            _unsafeGetPipelineManagerState,
            _setPipelineManagerState
        ], pipelineName)
    ).drain().then((_) => {
        return getExnFromStrictNull(tempSystemState)
    })
}

export let init = (state: state, initConfig) => {
    state = PipelineManager.init(state, [_unsafeGetPipelineManagerState, _setPipelineManagerState])

    //把配置保存到全局变量中，从而在Job中通过全局变量获得配置
    globalThis.initConfig = initConfig

    //运行Init Pipeline管道
    return _runPipeline(state, "init")
}

export let runPipeline1 = (state: state, pipeline1Config) => {
    //把配置保存到全局变量中，从而在Job中通过全局变量获得配置
    globalThis.pipeline1Config = pipeline1Config

    //运行某个X Pipeline
    return _runPipeline(state, 某个X Pipeline名)
}

更多的runPipelineX函数，运行对应的X Pipeline...