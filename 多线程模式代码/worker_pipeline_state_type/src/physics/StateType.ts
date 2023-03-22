import { component as transform } from "multithread_pattern_ecs/src/component/TransformComponentType"

export const pipelineName = "Worker_Phsycis"

export type state = {
    physicsDataBuffer: SharedArrayBuffer | null,
    allTransformIndices:Array<transform> | null,
    positions: Float32Array | null,
    transformComponentCount: number | null,
    transformComponentBuffer: SharedArrayBuffer | null
}

export type states = {
    [pipelineName]: state,
}
