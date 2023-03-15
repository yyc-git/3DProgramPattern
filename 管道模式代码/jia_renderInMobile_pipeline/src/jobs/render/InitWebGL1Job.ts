import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getState, setState } from "../Utils"
import { states } from "jia_renderInMobile_pipeline_state_type/src/StateType"

export let exec: execType = (managerState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<states>(managerState)

	let canvas: HTMLCanvasElement = globalThis.canvas

	return mostService.callFunc(() => {
		console.log("初始化WebGL1")

		let gl = canvas.getContext("webgl")

		return setStatesFunc<states>(
			managerState,
			setState(states, {
				...getState(states),
				gl: gl
			})
		)
	})
}