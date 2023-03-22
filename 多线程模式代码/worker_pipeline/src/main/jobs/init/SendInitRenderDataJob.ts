import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/main/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { getAllComponents as getAllNoLightMaterials } from "multithread_pattern_ecs/src/manager/noLightMaterial_component/Manager"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let { worker } = getState(states)

	return mostService.callFunc(() => {
		console.log("send init render data job exec on main worker")

		worker = getExnFromStrictNull(worker)

		let canvas: HTMLCanvasElement = globalThis.canvas
		let transformComponentCount = globalThis.transformComponentCount
		let noLightMaterialComponentCount = globalThis.noLightMaterialComponentCount

		let offscreenCanvas: OffscreenCanvas = canvas.transferControlToOffscreen()

		let allMaterialIndices = getAllNoLightMaterials(getExnFromStrictNull(worldState.ecsData.noLightMaterialComponentManagerState))

		worker.postMessage({
			operateType: "SEND_INIT_RENDER_DATA",
			canvas: offscreenCanvas,
			allMaterialIndices: allMaterialIndices,
			transformComponentCount,
			noLightMaterialComponentCount,
			transformComponentBuffer: getExnFromStrictNull(worldState.ecsData.transformComponentManagerState).buffer,
			noLightMaterialComponentBuffer: getExnFromStrictNull(worldState.ecsData.noLightMaterialComponentManagerState).buffer
		}, [offscreenCanvas])

		return worldState
	})
}