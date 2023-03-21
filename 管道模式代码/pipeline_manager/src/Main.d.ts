import { pipelineName } from "./type/PipelibeBasicType";
import { jobOrders } from "./type/RegisterPipelineType";
import { state } from "./type/StateType";
import { stream } from "most/src/StreamType";
import { pipeline } from "./type/PipelineType";

export function createState(): state

export function registerPipeline<worldState, pipelineState>(managerState: state, pipeline: pipeline<worldState, pipelineState>, jobOrers: jobOrders): state

export function unregisterPipeline(managerState: state, targetPipelineName: pipelineName): state

type unsafeGetWorldState<worldState> = () => worldState

type setWorldState<worldState> = (worldState: worldState) => void

type unsafeGetManagerState<worldState> = (worldState: worldState) => state

type setManagerState<worldState> = (worldState: worldState, state: state) => worldState

export function runPipeline<worldState>(
    worldState: worldState,
    [
        unsafeGetWorldState,
        setWorldState,
        unsafeGetManagerState,
        setManagerState
    ]: [
            unsafeGetWorldState<worldState>,
            setWorldState<worldState>,
            unsafeGetManagerState<worldState>,
            setManagerState<worldState>
        ],
    pipelineName: pipelineName
): stream<worldState>

export function init<worldState>(worldState: worldState,
    [
        unsafeGetManagerState,
        setManagerState
    ]: [
            unsafeGetManagerState<worldState>,
            setManagerState<worldState>
        ],
): worldState