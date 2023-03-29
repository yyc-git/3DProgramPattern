import { parseGLSLConfig } from "glsl_converter_abstract"
import { state } from "./MainStateType"
import { getData } from "./glsl/ShaderChunk"
import { Map } from "immutable"
import * as InitXxxMaterialShader from "./InitXxxMaterialShader"
import * as Render from "./Render"

export let createState = (shadersJson: JSON, shaderLibsJson: JSON): state => {
    let [shaders, shaderLibs] = parseGLSLConfig(shadersJson, shaderLibsJson)

    return {
        gl: xxx,
        programMap: Map(),
        sendDataMap: Map(),
        maxShaderIndex: 0,
        shaders,
        shaderLibs,
        shaderChunk: getData(),
        precision: "lowp",

        创建更多字段...
    }
}

export let initXxxMaterialShader = InitXxxMaterialShader.initXxxMaterialShader

export let render = Render.render