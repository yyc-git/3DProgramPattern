import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "worker_pipeline_state_type_abstract/src/worker_x/StateType"
import { exec as execGetInitWorkerXData } from "./jobs/init/GetInitWorkerXDataJob"
import { exec as execInitDataOrientedComponents } from "./jobs/init/InitDataOrientedComponentsJob"
import { exec as execDoSomethingWhenInit } from "./jobs/init/DoSomethingJob"
import { exec as execCreateWorkerXDataBufferTypeArray } from "./jobs/init/CreateWorkerXDataBufferTypeArrayJob"
import { exec as execSendFinishInitWorkerXData } from "./jobs/init/SendFinishInitWorkerXDataJob"
import { exec as execGetWorkerXData } from "./jobs/pipelineWhenLoop/GetWorkerXDataJob"
import { exec as execDoSomethingWhenLoop } from "./jobs/pipelineWhenLoop/DoSomethingJob"
import { exec as execSendFinishWorkerXData } from "./jobs/pipelineWhenLoop/SendFinishWorkerXDataJob"

let _getExec = (_pipelineName: string, jobName: string) => {
    switch (jobName) {
        case "get_init_workerX_data_workerX_worker":
            return execGetInitWorkerXData
        case "init_data_oriented_components_workerX_worker":
            return execInitDataOrientedComponents
        case "create_workerX_data_buffer_typeArray_workerX_worker":
            return execCreateWorkerXDataBufferTypeArray
        case "dosomething_when_init_workerX_worker":
            return execDoSomethingWhenInit
        case "send_finish_init_workerX_data_workerX_worker":
            return execSendFinishInitWorkerXData
        case "get_workerX_data_workerX_worker":
            return execGetWorkerXData
        case "dosomething_when_loop_workerX_worker":
            return execDoSomethingWhenLoop
        case "send_finish_workerX_data_workerX_worker":
            return execSendFinishWorkerXData
        default:
            return null
    }
}

export let getPipeline = (): pipeline<worldState, state> => {
    return {
        pipelineName: pipelineName,
        createState: worldState => {
            return {
                workerXDataBuffer: null,
                typeArray: null,
                allDataOrientedComponent1Indices: null,
                dataOrientedComponent1Count: null,
                dataOrientedComponent1Buffer: null,
                otherData: null
            }
        },
        getExec: _getExec,
        allPipelineData: [{
            name: "init",
            groups: [
                {
                    name: "first_workerX_worker",
                    link: "concat",
                    elements: [
                        {
                            "name": "get_init_workerX_data_workerX_worker",
                            "type_": "job"
                        },
                        {
                            "name": "init_data_oriented_components_workerX_worker",
                            "type_": "job"
                        },
                        {
                            "name": "create_workerX_data_buffer_typeArray_workerX_worker",
                            "type_": "job"
                        },
                        {
                            "name": "dosomething_when_init_workerX_worker",
                            "type_": "job"
                        },
                        {
                            "name": "send_finish_init_workerX_data_workerX_worker",
                            "type_": "job"
                        },
                    ]
                }
            ],
            first_group: "first_workerX_worker"
        },
        {
            name: "pipelineWhenLoop",
            groups: [
                {
                    name: "first_workerX_worker",
                    link: "concat",
                    elements: [
                        {
                            "name": "get_workerX_data_workerX_worker",
                            "type_": "job"
                        },
                        {
                            "name": "dosomething_when_loop_workerX_worker",
                            "type_": "job"
                        },
                        {
                            "name": "send_finish_workerX_data_workerX_worker",
                            "type_": "job"
                        },
                    ]
                }
            ],
            first_group: "first_workerX_worker"
        }
        ],
    }
}
