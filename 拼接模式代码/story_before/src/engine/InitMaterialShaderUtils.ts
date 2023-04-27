import { Map } from "immutable"
import { generateShaderIndex, createFakeProgram, setShaderIndex } from "splice_pattern_utils/src/engine/Shader"

export let initMaterialShader = (state, buildGLSL, shaderIndexMap, allMaterials) => {
    let [newProgramMap, newShaderIndexMap, _, newMaxShaderIndex] = allMaterials.reduce(([programMap, shaderIndexMap, glslMap, maxShaderIndex]: any, material) => {
        let glsl = buildGLSL(state, material)

        let [shaderIndex, newMaxShaderIndex] = generateShaderIndex(glslMap, glsl, maxShaderIndex)

        if (!programMap.has(shaderIndex)) {
            programMap = programMap.set(shaderIndex, createFakeProgram(glsl))
        }

        if (!glslMap.has(shaderIndex)) {
            glslMap = glslMap.set(shaderIndex, glsl)
        }

        // console.log(glsl)
        console.log("shaderIndex:", shaderIndex)

        return [
            programMap,
            setShaderIndex(shaderIndexMap, material, shaderIndex),
            glslMap,
            newMaxShaderIndex
        ]
    }, [state.programMap, shaderIndexMap, Map(), state.maxShaderIndex])

    return [newProgramMap, newShaderIndexMap, newMaxShaderIndex]
}