import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/physics/StateType"
import { createGetMainWorkerDataStream } from "../../../CreateWorkerDataStreamUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let allTransformIndices: Array<number>
    let physicsDataBuffer: SharedArrayBuffer
    let transformComponentCount: number
    let transformComponentBuffer: SharedArrayBuffer

    return createGetMainWorkerDataStream(
        mostService,
        (event: MessageEvent) => {
            allTransformIndices = event.data.allTransformIndices
            physicsDataBuffer = event.data.physicsDataBuffer
            transformComponentCount = event.data.transformComponentCount
            transformComponentBuffer = event.data.transformComponentBuffer
        },
        "SEND_INIT_PHYSICS_DATA",
        self as any as Worker
    ).map(() => {
        console.log("get init physics data job exec on physics worker");

        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...getState(states),
                allTransformIndices,
                physicsDataBuffer,
                transformComponentCount,
                transformComponentBuffer,
            })
        )
    })
}