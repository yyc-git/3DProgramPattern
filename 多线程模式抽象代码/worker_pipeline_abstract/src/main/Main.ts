import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "worker_pipeline_state_type_abstract/src/main/StateType"
import { exec as execCreateWorkerInstance } from "./jobs/init/CreateWorkerInstanceJob"
import { exec as execCreateXWorkerDataBuffer } from "./jobs/init/CreateXWorkerDataBufferJob"
import { exec as execSendInitXWorkerData } from "./jobs/init/SendInitXWorkerDataJob"
import { exec as execGetFinishSendInitXWorkerData } from "./jobs/init/GetFinishSendInitXWorkerDataJob"
import { exec as execDoSomething } from "./jobs/update/DoSomethingJob"
import { exec as execUpdateXWorkerDataBuffer } from "./jobs/update/UpdateXWorkerDataBufferJob"
import { exec as execSendXWorkerData } from "./jobs/update/SendXWorkerDataJob"
import { exec as execSendBeginLoopData } from "./jobs/update/SendBeginLoopDataJob"
import { exec as execGetFinishXWorkerData } from "./jobs/sync/GetFinishXWorkerDataJob"
import { exec as execUpdateSharedData } from "./jobs/sync/UpdateSharedDataJob"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "create_worker_instance_main_worker":
			return execCreateWorkerInstance
		case "create_xWorker_data_buffer_main_worker":
			return execCreateXWorkerDataBuffer
		case "send_init_xWorker_data_main_worker":
			return execSendInitXWorkerData
		case "get_finish_send_init_xWorker_data_main_worker":
			return execGetFinishSendInitXWorkerData
		case "dosomething_main_worker":
			return execDoSomething
		case "update_xWorker_data_buffer_main_worker":
			return execUpdateXWorkerDataBuffer
		case "send_xWorker_data_main_worker":
			return execSendXWorkerData
		case "send_begin_loop_data_main_worker":
			return execSendBeginLoopData
		case "get_finish_xWorker_data_main_worker":
			return execGetFinishXWorkerData
		case "update_shared_data_main_worker":
			return execUpdateSharedData
		default:
			return null

	}
}

export let getPipeline = (): pipeline<worldState, state> => {
	return {
		pipelineName: pipelineName,
		createState: worldState => {
			return {
				xWorkerWorker: null,
				xWorkerDataBuffer: null,
				xWorkerDataBufferTypeArray: null,
				xWorkerOtherData: null
			}
		},
		getExec: _getExec,
		allPipelineData: [{
			name: "init",
			groups: [
				{
					name: "first_main_worker",
					link: "concat",
					elements: [
						{
							"name": "create_worker_instance_main_worker",
							"type_": "job"
						},
						{
							"name": "begin_init",
							"type_": "group"
						}
					]
				},
				{
					name: "begin_init",
					link: "merge",
					elements: [
						{
							"name": "init",
							"type_": "group"
						},
						{
							"name": "wait",
							"type_": "group"
						},
					]
				},
				{
					name: "init",
					link: "concat",
					elements: [
						{
							"name": "create_xWorker_data_buffer_main_worker",
							"type_": "job"
						},
						{
							"name": "send_init_xWorker_data_main_worker",
							"type_": "job"
						}
					]
				},
				{
					name: "wait",
					link: "merge",
					elements: [
						{
							"name": "get_finish_send_init_xWorker_data_main_worker",
							"type_": "job",
							//is_set_state为false的意思是该Job不更新state
							//这通常用在merge的job，该job没有操作state
							is_set_state: false
						}
					]
				}
			],
			first_group: "first_main_worker"
		},
		{
			name: "update",
			groups: [
				{
					name: "first_main_worker",
					link: "concat",
					elements: [
						{
							"name": "begin_update",
							"type_": "group"
						}
					]
				},
				{
					name: "begin_update",
					link: "concat",
					elements: [
						{
							"name": "update_xWorker_data_buffer_main_worker",
							"type_": "job"
						},
						{
							"name": "send_begin_loop_data_main_worker",
							"type_": "job"
						},
						{
							"name": "send_xWorker_data_main_worker",
							"type_": "job"
						},
						{
							"name": "update",
							"type_": "group"
						}
					]
				},
				{
					name: "update",
					link: "concat",
					elements: [
						{
							"name": "dosomething_main_worker",
							"type_": "job"
						},
					]
				}
			],
			first_group: "first_main_worker"
		},
		{
			name: "sync",
			groups: [
				{
					name: "first_main_worker",
					link: "concat",
					elements: [
						{
							"name": "wait",
							"type_": "group",
						},
						{
							"name": "update_shared_data_main_worker",
							"type_": "job"
						}
					]
				},
				{
					name: "wait",
					link: "merge",
					elements: [
						{
							"name": "get_finish_xWorker_data_main_worker",
							"type_": "job",
							is_set_state: false
						}
					]
				},
			],
			first_group: "first_main_worker"
		}
		],
	}
}
