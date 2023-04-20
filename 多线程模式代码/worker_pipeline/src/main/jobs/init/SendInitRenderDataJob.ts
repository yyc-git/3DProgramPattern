import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/main/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let { renderWorker, renderDataBuffer } = getState(states)

	return mostService.callFunc(() => {
		console.log("send init render data job exec on main worker")

		renderWorker = getExnFromStrictNull(renderWorker)

		let canvas: HTMLCanvasElement = (globalThis as any).canvas
		let transformComponentCount = (globalThis as any).transformComponentCount
		let basicMaterialComponentCount = (globalThis as any).basicMaterialComponentCount

		let offscreenCanvas: OffscreenCanvas = canvas.transferControlToOffscreen()

		renderWorker.postMessage({
			command: "SEND_INIT_RENDER_DATA",
			canvas: offscreenCanvas,
			renderDataBuffer: getExnFromStrictNull(renderDataBuffer),
			transformComponentCount,
			basicMaterialComponentCount,
			transformComponentBuffer: getExnFromStrictNull(worldState.ecsData.transformComponentManagerState).buffer,
			basicMaterialComponentBuffer: getExnFromStrictNull(worldState.ecsData.basicMaterialComponentManagerState).buffer
		}, [offscreenCanvas])

		return worldState
	})
}