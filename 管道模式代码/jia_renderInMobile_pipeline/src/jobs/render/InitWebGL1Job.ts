import { state as renderState } from "render/src/RenderStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getState, setState } from "../Utils"
import { states } from "jia_renderInMobile_pipeline_state_type/src/StateType"

export let exec: execType<renderState> = (renderState, { getStatesFunc, setStatesFunc }) => {
    //从RenderState中获得所有的PipelineState
	let states = getStatesFunc<renderState, states>(renderState)

	let canvas: HTMLCanvasElement = globalThis.canvas

    //调用most.js库，返回了一个流
	return mostService.callFunc(() => {
		console.log("初始化WebGL1")

		let gl = canvas.getContext("webgl")

        //将新的states保存到RenderState中，返回新的RenderState
		return setStatesFunc<renderState, states>(
			renderState,
            //将新的JiaRenderInMobilePipelineState保存到states中，返回新的states
			setState(states, {
                //获得JiaRenderInMobilePipelineState，拷贝为新的JiaRenderInMobilePipelineState
				...getState(states),
                //保存gl到新的JiaRenderInMobilePipelineState中
				gl: gl
			})
		)
	})
}