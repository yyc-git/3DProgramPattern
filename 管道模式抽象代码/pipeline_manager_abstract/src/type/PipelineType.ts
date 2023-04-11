import type { stream as Meta3dBsMostProtocol_StreamType_stream } from 'most/src/StreamType'

import type { pipelineData as PipelineType_pipelineData } from './PipelineJsonType'

import type { pipelineName, pipelineName as PipelineType_pipelineName } from './PipelibeBasicType'

import { state, operateStatesFuncs } from "./StateType"

// tslint:disable-next-line:interface-over-type-literal
export type jobName = string

// tslint:disable-next-line:interface-over-type-literal
export type stream<a> = Meta3dBsMostProtocol_StreamType_stream<a>

// tslint:disable-next-line:interface-over-type-literal
export type exec<systemState> = (_1: systemState, _2: operateStatesFuncs) => stream<systemState>

// tslint:disable-next-line:interface-over-type-literal
export type getExec<systemState> = (_1: PipelineType_pipelineName, _2: jobName) => (null | undefined | exec<systemState>)

// tslint:disable-next-line:interface-over-type-literal
export type pipelineData = PipelineType_pipelineData

// tslint:disable-next-line:interface-over-type-literal
export type createState<pipelineState> = (state: state) => pipelineState

// tslint:disable-next-line:interface-over-type-literal
export type allPipelineData = pipelineData[]

// tslint:disable-next-line:interface-over-type-literal
export type pipeline<systemState, pipelineState> = {
    readonly pipelineName: pipelineName
    readonly createState: createState<pipelineState>
    readonly getExec: getExec<systemState>
    readonly allPipelineData: allPipelineData
}