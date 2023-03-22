import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/main/StateType"

let _getMaxRenderGameObjectCount = () => 3000

let _getStride = () => 2 * 4

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	return mostService.callFunc(() => {
		console.log("create render data buffer job exec on main worker")

		let buffer = new SharedArrayBuffer(
			_getMaxRenderGameObjectCount() * _getStride()
		)

		let uint32Array = new Uint32Array(buffer)


		return setStatesFunc<worldState, states>(
			worldState,
			setState(states, {
				...getState(states),
				typeArray: uint32Array
			})
		)
	})
}