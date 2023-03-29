import type { Map } from "immutable"

export type transform = number

export type state = {
    modelMatrixs: Map<transform, Float32Array>
}
