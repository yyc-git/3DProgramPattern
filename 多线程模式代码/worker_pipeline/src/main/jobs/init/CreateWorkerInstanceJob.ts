import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/main/StateType"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    return mostService.callFunc(() => {
        console.log("create worker instance job exec on main worker")

        // reference https://webpack.docschina.org/guides/web-workers/#root
        let worker = new Worker(new URL("../../../render/RenderWorkerMain", import.meta.url))

        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...getState(states),
                worker: worker
            })
        )
    })
}