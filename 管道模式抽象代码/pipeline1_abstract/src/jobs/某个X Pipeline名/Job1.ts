import { state as systemState } from "system_abstract/src/SystemStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager_abstract/src/type/PipelineType"
import * as Utils from "../Utils"
import { states } from "pipeline1_state_type_abstract/src/StateType"

export let exec: execType<systemState> = (systemState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<states>(systemState)

    //通过全局变量获得配置
    let initConfig = globalThis.initConfig
    let pipeline1Config = globalThis.pipeline1Config

    return mostService.callFunc(() => {
        let xxx = Utils.获得依赖的其它PipelineState的数据(states)
        //获得自己的PipelineState
        let pipelineState = Utils.getState(states)

        if (需要写数据到自己的PipelineState) {
            return setStatesFunc<systemState, states>(
                systemState,
                Utils.setState(states, {
                    ...Utils.getState(states),
                    写数据
                })
            )
        }
        else if (需要写数据到其它的PipelineState) {
            return setStatesFunc<systemState, states>(
                systemState,
                Utils.设置依赖的其它PipelineState(states, {
                    ...Utils.获得依赖的其它PipelineState(states),
                    写数据
                })
            )
        }
        else {
            return systemState
        }
    })
}