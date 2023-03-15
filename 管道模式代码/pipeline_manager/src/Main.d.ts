import { pipelineName } from "./type/PipelibeBasicType";
import { jobOrders } from "./type/RegisterPipelineType";
import { state } from "./type/StateType";
import { stream } from "most/src/StreamType";
import { pipeline } from "./type/PipelineType";

export function createState(): state

export function registerPipeline<pipelineState>(managerState: state, pipeline: pipeline<pipelineState>, jobOrers: jobOrders): state

export function unregisterPipeline(managerState: state, targetPipelineName: pipelineName): state

export function runPipeline(
    managerState: state,
    pipelineName: pipelineName
): stream<state>