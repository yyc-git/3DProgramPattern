import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getGL } from "../Utils"
import { states } from "yi_renderInMobile_pipeline_state_type/src/StateType"

export let exec: execType = (managerState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<states>(managerState)

	return mostService.callFunc(() => {
		let gl = getGL(states)

		console.log("前向渲染")

		return managerState
	})
}