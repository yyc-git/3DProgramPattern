import { state as renderState } from "render/src/RenderStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "jia_renderInMobile_pipeline_state_type/src/StateType"
import { exec as execInitWebGL1 } from "./jobs/render/InitWebGL1Job"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "init_webgl1_jia_renderInMobile":
			return execInitWebGL1
		default:
			return null
	}
}

export let getPipeline = (): pipeline<renderState, state> => {
	return {
		pipelineName: pipelineName,
		createState: renderState => {
			return {
				gl: null
			}
		},
		getExec: _getExec,
		allPipelineData: [
			{
				name: "render",
				groups: [
					{
						name: "first_jia_renderInMobile",
						link: "concat",
						elements: [
							{
								"name": "init_webgl1_jia_renderInMobile",
								"type_": "job"
							}
						]
					}
				],
				first_group: "first_jia_renderInMobile"
			}
		],
	}
}
