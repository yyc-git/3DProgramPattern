import { state as engineState } from "engine/src/EngineStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "yi_engineInMobile_pipeline_state_type/src/StateType"
import * as TonemapJob from "./jobs/render/TonemapJob"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "tonemap_yi_engineInMobile":
			return TonemapJob.exec
		default:
			return null
	}
}

export let getPipeline = (): pipeline<engineState, state> => {
	return {
		pipelineName: pipelineName,
		createState: engineState => {
			return {
			}
		},
		getExec: _getExec,
		allPipelineData: [
			{
				name: "render",
				groups: [
					{
						name: "first_yi_engineInMobile",
						link: "concat",
						elements: [
							{
								"name": "tonemap_yi_engineInMobile",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_yi_engineInMobile"
			}
		],
	}
}
