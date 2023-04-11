import { state } from "./SystemStateType"
import { state as pipelineState } from "pipeline_manager_abstract/src/type/StateType"
import { createState as createPipelineManagerState, registerPipeline, runPipeline, init as initPipelineManager } from "pipeline_manager_abstract"
import { getPipeline as getPipeline1 } from "pipeline1_abstract/src/Main"
import { service as mostService } from "most/src/MostService"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { unsafeGetState, setState } from "./SystemStateContainer"

declare function _isEnvironment1(): boolean

export let createState = (): state => {
    return {
        pipelineManagerState: createPipelineManagerState()
    }
}

export let registerAllPipelines = (state: state) => {
    if (_isEnvironment1()) {
        let pipelineManagerState = registerPipeline(
            state.pipelineManagerState,
            getPipeline1(),
            []
        )

        if (需要合并某个X Pipeline) {
            //合并Pipeline2和Pipeline1的X Pipeline管道
            pipelineManagerState = registerPipeline(
                pipelineManagerState,
                getPipeline2(),
                [
                    {
                        pipelineName: 某个X Pipeline名,
                        insertElementName: 插入到的Element名,
                        insertAction: "before" or "after" 
                    },
                    指定其它的X Pipeline的合并...
                ]
            )
        }

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

let _unsafeGetPipeManagerState = (state: state) => {
    return state.pipelineManagerState
}

let _setPipeManagerState = (state: state, pipelineManagerState: pipelineState) => {
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
        runPipeline<state>(state, [
            unsafeGetState,
            setState,
            _unsafeGetPipeManagerState,
            _setPipeManagerState
        ], pipelineName)
    ).drain().then((_) => {
        return getExnFromStrictNull(tempSystemState)
    })
}

export let init = (state: state, config) => {
    state = initPipelineManager(state, [_unsafeGetPipeManagerState, _setPipeManagerState])

    //把配置保存到全局变量中，从而在Job中通过全局变量获得配置
    globalThis.config = config

    //管道模块通常包含一个Init Pipeline管道，包括了与初始化相关的Job
    //这里运行Init Pipeline管道
    return _runPipeline(state, "init")
}

export let runPipeline1 = (state: state, config) => {
    //把配置保存到全局变量中，从而在Job中通过全局变量获得配置
    globalThis.config = config

    return _runPipeline(state, 某个X Pipeline名)
}

更多的runPipeline函数，运行对应的X Pipeline...