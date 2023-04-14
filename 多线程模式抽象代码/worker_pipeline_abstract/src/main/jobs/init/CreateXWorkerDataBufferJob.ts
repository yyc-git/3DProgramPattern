import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type_abstract/src/main/StateType"

let _getMaxXxxCount = () => (globalThis as any).xxx

let _getStride = () => xxx

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	return mostService.callFunc(() => {
		let buffer = new SharedArrayBuffer(
			_getMaxXxxCount() * _getStride()
		)

		let xWorkerDataBufferTypeArray = new Float32Array | Uint8Array | Uint16Array | Uint32Array(buffer)

		return setStatesFunc<worldState, states>(
			worldState,
			setState(states, {
				...getState(states),
				xWorkerDataBuffer: buffer,
				xWorkerDataBufferTypeArray: xWorkerDataBufferTypeArray
			})
		)
	})
}