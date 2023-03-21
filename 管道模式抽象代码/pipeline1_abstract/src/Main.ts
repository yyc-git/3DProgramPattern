import { pipeline } from "pipeline_manager_abstract/src/type/PipelineType"
import { pipelineName, state } from "pipeline1_state_type_abstract/src/StateType"
import { exec as execJob1 } from "./jobs/管道1的名称/Job1"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case Job1的JSON名称
			return execJob1
		case 更多Job的JSON名称...
			return ...
		default:
			return null
	}
}

export let getPipeline = (): pipeline<state> => {
	return {
		pipelineName: pipelineName,
		createState: worldState => {
			return 初始化管道State
		},
		getExec: _getExec,
		allPipelineData: [
			{
				name: 管道1的名称,
				groups: [
					{
						name: "first_xxx",
						link: "concat" or "merge"
							elements: [
								包含的group或者job的配置数据（将会依次按照link的方式执行每个element）
							]
				}
				],
				first_group: "first_xxx"
			},

			更多管道的配置数据...

			],
	}
}
