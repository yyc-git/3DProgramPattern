import { state as renderState } from "render/src/RenderStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getState, setState } from "../Utils"
import { states } from "renderInPC_pipeline_state_type/src/StateType"

export let exec: execType<renderState> = (renderState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<renderState, states>(renderState)

	let canvas: HTMLCanvasElement = globalThis.canvas

	return mostService.callFunc(() => {
		console.log("初始化WebGL2")

		let gl = canvas.getContext("webgl2")

		return setStatesFunc<renderState, states>(
			renderState,
			setState(states, {
				...getState(states),
				gl: gl
			})
		)
	})
}