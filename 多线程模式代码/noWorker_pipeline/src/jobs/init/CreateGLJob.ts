import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import {  states } from "noWorker_pipeline_state_type/src/StateType"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let canvas: HTMLCanvasElement = globalThis.canvas

	return mostService.callFunc(() => {
		console.log("create gl job")

		let gl = canvas.getContext("webgl")

		return setStatesFunc<worldState, states>(
			worldState,
			setState(states, {
				...getState(states),
				gl: gl
			})
		)
	})
}