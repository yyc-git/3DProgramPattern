import { shaderLibs, shaders } from "glsl_handler/src/GLSLConfigType.gen"
import { state as basicMaterialState } from "./BasicMaterialStateType"

export type state = {
    shaders: shaders,
    shaderLibs: shaderLibs,
    basicMaterialState: basicMaterialState
}