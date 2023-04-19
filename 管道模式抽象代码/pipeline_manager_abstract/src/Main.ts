import { pipelineName } from "./type/PipelibeBasicType";
import { jobOrders } from "./type/RegisterPipelineType";
import { state } from "./type/StateType";
import { stream } from "most/src/StreamType";
import { pipeline } from "./type/PipelineType";

export declare function createState(): state

export declare function registerPipeline<systemState, pipelineState>(pipelineManagerState: state, pipeline: pipeline<systemState, pipelineState>, jobOrers: jobOrders): state

export declare function unregisterPipeline(pipelineManagerState: state, targetPipelineName: pipelineName): state

type unsafeGetSystemState<systemState> = () => systemState

type setSystemState<systemState> = (systemState: systemState) => void

type unsafeGetPipelineManagerState<systemState> = (systemState: systemState) => state

type setPipelineManagerState<systemState> = (systemState: systemState, state: state) => systemState

export declare function runPipeline<systemState>(
    systemState: systemState,
    [
        unsafeGetSystemState,
        setSystemState,
        unsafeGetPipelineManagerState,
        setPipelineManagerState
    ]: [
            unsafeGetSystemState<systemState>,
            setSystemState<systemState>,
            unsafeGetPipelineManagerState<systemState>,
            setPipelineManagerState<systemState>
        ],
    pipelineName: pipelineName
): stream<systemState>

export declare function init<systemState>(systemState: systemState,
    [
        unsafeGetPipelineManagerState,
        setPipelineManagerState
    ]: [
            unsafeGetPipelineManagerState<systemState>,
            setPipelineManagerState<systemState>
        ],
): systemState