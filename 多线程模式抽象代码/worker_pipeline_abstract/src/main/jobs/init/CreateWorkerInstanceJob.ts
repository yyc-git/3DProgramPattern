import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type_abstract/src/main/StateType"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    return mostService.callFunc(() => {
        // reference https://webpack.docschina.org/guides/web-workers/#root
        let workerXWorker = new Worker(new URL("../../../worker_x/WorkerXMain", import.meta.url))

        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...getState(states),
                workerXWorker
            })
        )
    })
}