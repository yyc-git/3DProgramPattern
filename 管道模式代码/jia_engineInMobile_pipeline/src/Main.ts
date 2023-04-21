import { state as engineState } from "engine/src/EngineStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "jia_engineInMobile_pipeline_state_type/src/StateType"
import * as InitWebGL1Job from "./jobs/init/InitWebGL1Job"
import * as ForwardRenderJob from "./jobs/render/ForwardRenderJob"

//返回Job的exec函数
let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "init_webgl1_jia_engineInMobile":
			return InitWebGL1Job.exec
		case "forward_render_jia_engineInMobile":
			return ForwardRenderJob.exec
		default:
			return null
	}
}

//获得管道模块的模块数据
export let getPipeline = (): pipeline<engineState, state> => {
	return {
		//pipelineName来自JiaEngineInMobilePipelineStateType，值为"JiaEngineInMobile"
		pipelineName: pipelineName,
		//创建JiaEngineInMobilePipelineState
		createState: engineState => {
			return {
				gl: null
			}
		},
		//getExec关联了allPipelineData中的job名与管道的Job
		getExec: _getExec,
		//allPipelineData是JSON配置数据，用来指定Job的执行顺序
		//它包括所有管道的配置数据，目前只有Render Pipeline管道的配置数据
		allPipelineData: [
            //Init Pipeline管道配置数据
			{
				//管道名
				name: "init",
				//groups包括所有的group，目前只有一个group
				groups: [
					{
						//group名
						name: "first_jia_engineInMobile",
						//link指定了该group包括的所有element之间的链接方式
						//有两种链接方式：concat或者merge
						//concat是指每个element串行执行
						//merge是指每个element并行执行
						link: "concat",
						//elements是该group包含的所有element
						//element的类型可以为job或者group
						//目前只有一个类型为job的element
						elements: [
							{
								"name": "init_webgl1_jia_engineInMobile",
								"type_": "job"
							}
						]
					}
				],
				//运行该管道时首先执行的group名
				first_group: "first_jia_engineInMobile"
			},
            //Render Pipeline管道配置数据
			{
				name: "render",
				groups: [
					{
						name: "first_jia_engineInMobile",
						link: "concat",
						elements: [
							{
								"name": "forward_render_jia_engineInMobile",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_jia_engineInMobile"
			}
		]
	}
}