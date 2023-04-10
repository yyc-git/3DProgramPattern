import { state as renderState } from "render/src/RenderStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "jia_renderInMobile_pipeline_state_type/src/StateType"
import { exec as execInitWebGL1 } from "./jobs/render/InitWebGL1Job"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "init_webgl1_jia_renderInMobile":
            //返回Job的exec函数
			return execInitWebGL1
		default:
			return null
	}
}

//获得管道模块的数据
export let getPipeline = (): pipeline<renderState, state> => {
	return {
        //pipelineName来自JiaRenderInMobilePipelineStateType，这里具体为"JiaRenderInMobile"
		pipelineName: pipelineName,
        //创建JiaRenderInMobilePipelineState
		createState: renderState => {
			return {
				gl: null
			}
		},
        //getExec关联了allPipelineData中的job名与管道的Job
		getExec: _getExec,
        //allPipelineData是JSON配置数据，用来指定Job的执行顺序
        //它包括多个管道的配置数据，这里只有一个Render Pipeline管道
		allPipelineData: [
			{
                //管道名
				name: "render",
                //groups包括所有的group，这里只有一个group
				groups: [
					{
                        //group名
						name: "first_jia_renderInMobile",
                        //link指定了该group包括的所有element之间的链接方式
                        //有两种链接方式：concat或者merge
                        //concat是指每个element串行执行
                        //merge是指每个element并行执行
						link: "concat",
                        //elements是该group包含的所有element
                        //element的类型可以为job或者group
                        //这里只有一个类型为job的element
						elements: [
							{
								"name": "init_webgl1_jia_renderInMobile",
								"type_": "job"
							}
						]
					}
				],
                //运行该管道时首先执行的group名
				first_group: "first_jia_renderInMobile"
			}
		],
	}
}