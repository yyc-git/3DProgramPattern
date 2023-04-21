import { state as engineState } from "engine/src/EngineStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getState, setState } from "../Utils"
import { states } from "jia_engineInMobile_pipeline_state_type/src/StateType"

export let exec: execType<engineState> = (engineState, { getStatesFunc, setStatesFunc }) => {
    //从EngineState中获得所有的PipelineState
	let states = getStatesFunc<engineState, states>(engineState)

    //从全局变量中获得canvas
	let canvas: HTMLCanvasElement = globalThis.canvas

    //调用most.js库，返回了一个流
	return mostService.callFunc(() => {
		console.log("初始化WebGL1")

		let gl = canvas.getContext("webgl")

        //将新的states保存到EngineState中，返回新的EngineState
		return setStatesFunc<engineState, states>(
			engineState,
            //将新的JiaEngineInMobilePipelineState保存到states中，返回新的states
			setState(states, {
                //获得JiaEngineInMobilePipelineState，拷贝为新的JiaEngineInMobilePipelineState
				...getState(states),
                //保存gl到新的JiaEngineInMobilePipelineState中
				gl: gl
			})
		)
	})
}