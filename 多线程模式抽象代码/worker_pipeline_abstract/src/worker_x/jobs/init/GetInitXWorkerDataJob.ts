import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type_abstract/src/x_worker/StateType"
import { createGetMainWorkerDataStream } from "../../../CreateWorkerDataStreamUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let xWorkerDataBuffer: SharedArrayBuffer
    let allDataOrientedComponent1Indices: Array<number>
    let dataOrientedComponent1Count: number
    let dataOrientedComponent1Buffer: SharedArrayBuffer
    let otherData

    return createGetMainWorkerDataStream(
        mostService,
        (event: MessageEvent) => {
            xWorkerDataBuffer = event.data.xWorkerDataBuffer
            allDataOrientedComponent1Indices = event.data.allDataOrientedComponent1Indices
            dataOrientedComponent1Count = event.data.dataOrientedComponent1Count
            dataOrientedComponent1Buffer = event.data.dataOrientedComponent1Buffer
            otherData = event.data.otherData
        },
        "SEND_INIT_WORKERX_DATA",
        self as any as Worker
    ).map(() => {
        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...getState(states),
                xWorkerDataBuffer: xWorkerDataBuffer,
                allDataOrientedComponent1Indices: allDataOrientedComponent1Indices,
                dataOrientedComponent1Count: dataOrientedComponent1Count,
                dataOrientedComponent1Buffer: dataOrientedComponent1Buffer,
                otherData: otherData
            })
        )
    })
}