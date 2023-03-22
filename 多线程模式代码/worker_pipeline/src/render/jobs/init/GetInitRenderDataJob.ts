import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/render/StateType"
import { createGetMainWorkerDataStream } from "../../../CreateWorkerDataStreamUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let offscreenCanvas: OffscreenCanvas;
    let allMaterialIndices: number[];
    let transformComponentCount, noLightMaterialComponentCount
    let transformComponentBuffer, noLightMaterialComponentBuffer

    return createGetMainWorkerDataStream(
        mostService,
        (event: MessageEvent) => {
            offscreenCanvas = event.data.canvas;
            allMaterialIndices = event.data.allMaterialIndices
            transformComponentCount = event.data.transformComponentCount
            noLightMaterialComponentCount = event.data.noLightMaterialComponentCount
            transformComponentBuffer = event.data.transformComponentBuffer
            noLightMaterialComponentBuffer = event.data.noLightMaterialComponentBuffer
        },
        "SEND_INIT_RENDER_DATA",
        self as any as Worker
    ).map(() => {
        console.log("get init render data job exec on render worker");

        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...getState(states),
                canvas: offscreenCanvas,
                allMaterialIndices: allMaterialIndices,
                transformComponentCount: transformComponentCount,
                noLightMaterialComponentCount: noLightMaterialComponentCount,
                transformComponentBuffer: transformComponentBuffer,
                noLightMaterialComponentBuffer: noLightMaterialComponentBuffer
            })
        )
    })
}