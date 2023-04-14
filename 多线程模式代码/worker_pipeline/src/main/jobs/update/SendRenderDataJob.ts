import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/Main/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let { renderWorker, renderGameObjectsCount } = getState(states)

	return mostService.callFunc(() => {
		console.log("send render data job exec on main worker")

		renderWorker = getExnFromStrictNull(renderWorker)
		renderGameObjectsCount = getExnFromStrictNull(renderGameObjectsCount)

		//假的相机数据
		let viewMatrix = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0])
		let pMatrix = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0])

		renderWorker.postMessage({
			command: "SEND_RENDER_DATA",
			camera: {
				viewMatrix,
				pMatrix
			},
			renderDataBuffer: {
				renderGameObjectCount: renderGameObjectsCount
			}
		})

		return worldState
	})
}