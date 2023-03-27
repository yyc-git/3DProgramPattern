import { parse } from "glsl_handler"

export let parseGLSLConfig = (shadersJson, shaderLibsJson) => {
    return parse(shadersJson, shaderLibsJson)
}