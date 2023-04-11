import { pipelineName } from "./type/PipelibeBasicType";
import { jobOrders } from "./type/RegisterPipelineType";
import { state } from "./type/StateType";
import { stream } from "most/src/StreamType";
import { pipeline } from "./type/PipelineType";

export declare function createState(): state

export declare function registerPipeline<worldState, pipelineState>(managerState: state, pipeline: pipeline<worldState, pipelineState>, jobOrers: jobOrders): state

export declare function unregisterPipeline(managerState: state, targetPipelineName: pipelineName): state

type unsafeGetWorldState<worldState> = () => worldState

type setWorldState<worldState> = (worldState: worldState) => void

type unsafeGetPipelineManagerState<worldState> = (worldState: worldState) => state

type setPipelineManagerState<worldState> = (worldState: worldState, state: state) => worldState

export declare function runPipeline<worldState>(
    worldState: worldState,
    [
        unsafeGetWorldState,
        setWorldState,
        unsafeGetPipelineManagerState,
        setPipelineManagerState
    ]: [
            unsafeGetWorldState<worldState>,
            setWorldState<worldState>,
            unsafeGetPipelineManagerState<worldState>,
            setPipelineManagerState<worldState>
        ],
    pipelineName: pipelineName
): stream<worldState>

export declare function init<worldState>(worldState: worldState,
    [
        unsafeGetPipelineManagerState,
        setPipelineManagerState
    ]: [
            unsafeGetPipelineManagerState<worldState>,
            setPipelineManagerState<worldState>
        ],
): worldState