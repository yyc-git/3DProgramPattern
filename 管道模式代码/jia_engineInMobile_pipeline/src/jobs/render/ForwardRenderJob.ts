import { state as engineState } from "engine/src/EngineStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "yi_engineInMobile_pipeline_state_type/src/StateType"
import { getState } from "../Utils"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<engineState> = (engineState, { getStatesFunc }) => {
	let states = getStatesFunc<engineState, states>(engineState)

	let { gl } = getState(states)

	return mostService.callFunc(() => {
		gl = getExnFromStrictNull(gl)

		console.log("前向渲染")

		return engineState
	})
}