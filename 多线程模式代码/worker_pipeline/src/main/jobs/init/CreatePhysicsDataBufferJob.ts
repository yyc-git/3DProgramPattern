import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/main/StateType"

let _getMaxTransformComponentCount = () => (globalThis as any).transformComponentCount

let _getStride = () => 3 * 4

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	return mostService.callFunc(() => {
		console.log("create physics data buffer job exec on main worker")

		let buffer = new SharedArrayBuffer(
			_getMaxTransformComponentCount() * _getStride()
		)

		let physicsDataBufferTypeArray = new Float32Array(buffer)

		return setStatesFunc<worldState, states>(
			worldState,
			setState(states, {
				...getState(states),
				physicsDataBuffer: buffer,
				physicsDataBufferTypeArray: physicsDataBufferTypeArray
			})
		)
	})
}