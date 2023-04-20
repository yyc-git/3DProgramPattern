import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "worker_pipeline_state_type/src/physics/StateType"
import { exec as execGetInitPhysicsDataJob } from "./jobs/init/GetInitPhysicsDataJob"
import { exec as execGetPhysicsDataJob } from "./jobs/update/GetPhysicsDataJob"
import { exec as execInitDataOrientedComponents } from "./jobs/init/InitDataOrientedComponentsJob"
import { exec as execCreatePhysicsDataBufferTypeArray } from "./jobs/init/CreatePhysicsDataBufferTypeArrayJob"
import { exec as execSendFinishInitPhysicsData } from "./jobs/init/SendFinishInitPhysicsDataJob"
import { exec as execComputePhysics } from "./jobs/update/ComputePhysicsJob"
import { exec as execSendFinishPhysicsData } from "./jobs/update/SendFinishPhysicsDataJob"

let _getExec = (_pipelineName: string, jobName: string) => {
    switch (jobName) {
        case "get_init_physics_data_physics_worker":
            return execGetInitPhysicsDataJob
        case "init_data_oriented_components_physics_worker":
            return execInitDataOrientedComponents
        case "create_physics_data_buffer_typeArray_physics_worker":
            return execCreatePhysicsDataBufferTypeArray
        case "send_finish_init_physics_data_physics_worker":
            return execSendFinishInitPhysicsData
        case "get_physics_data_physics_worker":
            return execGetPhysicsDataJob
        case "compute_physics_physics_worker":
            return execComputePhysics
        case "send_finish_physics_data_physics_worker":
            return execSendFinishPhysicsData
        default:
            return null
    }
}

export let getPipeline = (): pipeline<worldState, state> => {
    return {
        pipelineName: pipelineName,
        createState: worldState => {
            return {
                allTransformIndices: null,
                positions: null,
                physicsDataBuffer: null,
                transformComponentCount: null,
                transformComponentBuffer: null
            }
        },
        getExec: _getExec,
        allPipelineData: [
            {
                name: "init",
                groups: [
                    {
                        name: "first_physics_worker",
                        link: "concat",
                        elements: [
                            {
                                "name": "get_init_physics_data_physics_worker",
                                "type_": "job"
                            },
                            {
                                "name": "init_data_oriented_components_physics_worker",
                                "type_": "job"
                            },
                            {
                                "name": "create_physics_data_buffer_typeArray_physics_worker",
                                "type_": "job"
                            },
                            {
                                "name": "send_finish_init_physics_data_physics_worker",
                                "type_": "job"
                            },
                        ]
                    }
                ],
                first_group: "first_physics_worker"
            },
            {
                name: "update",
                groups: [
                    {
                        name: "first_physics_worker",
                        link: "concat",
                        elements: [
                            {
                                "name": "get_physics_data_physics_worker",
                                "type_": "job"
                            },
                            {
                                "name": "compute_physics_physics_worker",
                                "type_": "job"
                            },
                            {
                                "name": "send_finish_physics_data_physics_worker",
                                "type_": "job"
                            },
                        ]
                    }
                ],
                first_group: "first_physics_worker"
            },
        ],
    }
}
