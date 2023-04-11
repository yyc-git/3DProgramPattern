import { state as systemState } from "system_abstract/src/SystemStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager_abstract/src/type/PipelineType"
import { getState, setState, 获得依赖的其它PipelineState的数据 } from "../Utils"
import { states } from "pipeline1_state_type_abstract/src/StateType"

export let exec: execType<systemState> = (systemState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<states>(systemState)

    return mostService.callFunc(() => {
        let xxx = 获得依赖的其它PipelineState的数据(states)
        //获得自己的PipelineState
        let pipelineState = getState(states)

        if (需要写数据到自己的PipelineState) {
            return setStatesFunc<systemState, states>(
                systemState,
                setState(states, {
                    ...getState(states),
                    写数据
                })
            )
        }
        else {
            return systemState
        }
    })
}