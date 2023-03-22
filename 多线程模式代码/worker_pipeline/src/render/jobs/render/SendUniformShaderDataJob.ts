import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/render/StateType"
import { sendCameraData } from "multithread_pattern_webgl_pipeline_utils/src/utils/SendCameraDataUtils"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let state = getState(states)

	return mostService.callFunc(() => {
		console.log("send uniform shader data job exec on render worker");

		let gl = getExnFromStrictNull(state.gl)

		let programs = state.programMap.toArray().map(([_, value]) => value)

		sendCameraData(gl, getExnFromStrictNull(state.viewMatrix), getExnFromStrictNull(state.pMatrix), programs);

		return worldState;
	})
}