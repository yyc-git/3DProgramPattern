import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/main/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { getAllComponents as getAllBasicMaterials } from "multithread_pattern_ecs/src/manager/basicMaterial_component/Manager"

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

		let allMaterialIndices = getAllBasicMaterials(getExnFromStrictNull(worldState.ecsData.basicMaterialComponentManagerState))

		renderWorker.postMessage({
			operateType: "SEND_INIT_RENDER_DATA",
			canvas: offscreenCanvas,
			renderDataBuffer: getExnFromStrictNull(renderDataBuffer),
			allMaterialIndices: allMaterialIndices,
			transformComponentCount,
			basicMaterialComponentCount,
			transformComponentBuffer: getExnFromStrictNull(worldState.ecsData.transformComponentManagerState).buffer,
			basicMaterialComponentBuffer: getExnFromStrictNull(worldState.ecsData.basicMaterialComponentManagerState).buffer
		}, [offscreenCanvas])

		return worldState
	})
}