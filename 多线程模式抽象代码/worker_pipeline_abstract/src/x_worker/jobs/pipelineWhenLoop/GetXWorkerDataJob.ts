import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type_abstract/src/x_worker/StateType"
import { createGetMainWorkerDataStream } from "../../../CreateWorkerDataStreamUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let someData

    return createGetMainWorkerDataStream(
        mostService,
        (event: MessageEvent) => {
            someData = event.data.someData
        },
        "SEND_XWORKER_DATA",
        self as any as Worker
    ).map(() => {
        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...getState(states),
                someData
            })
        )
    })
}