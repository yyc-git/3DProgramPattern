import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "noWorker_pipeline_state_type/src/StateType"
import { createVBOs } from "multithread_pattern_webgl_pipeline_utils/src/utils/VBOUtils"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let state = getState(states)

	return mostService.callFunc(() => {
		console.log("init vbo job")

		let gl = getExnFromStrictNull(state.gl)

		let {
			verticesBuffer,
			indicesBuffer
		} = createVBOs(gl)

		return setStatesFunc<worldState, states>(
			worldState,
			setState(states, {
				...getState(states),
				vbo: {
					verticesVBO: verticesBuffer,
					indicesVBO: indicesBuffer
				}
			})
		)
	})
}