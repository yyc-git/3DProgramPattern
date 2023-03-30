import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager_abstract/src/type/PipelineType"
import { getState, 获得依赖的其它管道的数据 } from "../Utils"
import { states } from "pipeline1_state_type_abstract/src/StateType"

export let exec: execType = (managerState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<states>(managerState)
    let 管道State = getState(states)

    return mostService.callFunc(() => {
        let xxx = 获得依赖的其它管道的数据(states)

        if (需要写数据到管道State) {
            return setStatesFunc<states>(
                managerState,
                setState(states, {
                    ...getState(states),
                    设置数据
                })
            )
        }
        else {
            return managerState
        }
    })
}