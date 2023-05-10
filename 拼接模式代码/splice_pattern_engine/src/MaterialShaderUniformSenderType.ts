import { state } from "./EngneStateType"
import { material } from "splice_pattern_utils/src/engine/MaterialType"
import { transform } from "splice_pattern_utils/src/engine/TransformStateType";

type getMaterialDataFunc = (state: state, material: material) => any

type getCameraDataFunc = (state: state) => any

type getModelDataFunc = (state: state, transform: transform) => Float32Array

type sendDataFunc = (gl: WebGLRenderingContext, pos: WebGLUniformLocation, data: any) => void

type singleSendMetadata<getDataFunc> = {
    pos: WebGLUniformLocation,
    getData: getDataFunc,
    sendData: sendDataFunc,
}

export type sendMetadata = {
    shaderSendMetadata?: singleSendMetadata<getCameraDataFunc>,
    renderObjectSendModelData?: singleSendMetadata<getModelDataFunc>,
    renderObjectSendMaterialData?: singleSendMetadata<getMaterialDataFunc>
}