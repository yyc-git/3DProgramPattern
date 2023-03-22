import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/render/StateType"
import { createGetMainWorkerDataStream } from "../../../CreateWorkerDataStreamUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let viewMatrix: Float32Array
    let pMatrix: Float32Array
    let typeArray: Uint32Array
    let renderGameObjectsCount: number

    return createGetMainWorkerDataStream(
        mostService,
        (event: MessageEvent) => {
            viewMatrix = event.data.camera.viewMatrix
            pMatrix = event.data.camera.pMatrix
            typeArray = event.data.renderDataBuffer.typeArray
            renderGameObjectsCount = event.data.renderDataBuffer.renderGameObjectCount
        },
        "SEND_RENDER_DATA",
        self as any as Worker
    ).map(() => {
        console.log("get init render data job exec on render worker")

        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...getState(states),
                viewMatrix: viewMatrix,
                pMatrix: pMatrix,
                typeArray: typeArray,
                renderGameObjectsCount: renderGameObjectsCount
            })
        )
    })
}