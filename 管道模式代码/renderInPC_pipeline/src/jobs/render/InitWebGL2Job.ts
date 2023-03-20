import { state as worldState } from "render/src/RenderStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getState, setState } from "../Utils"
import { states } from "renderInPC_pipeline_state_type/src/StateType"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let canvas: HTMLCanvasElement = globalThis.canvas

	return mostService.callFunc(() => {
		console.log("初始化WebGL2")

		let gl = canvas.getContext("webgl2")

		return setStatesFunc<worldState, states>(
			worldState,
			setState(states, {
				...getState(states),
				gl: gl
			})
		)
	})
}