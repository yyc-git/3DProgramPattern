import * as BasicMaterial from "splice_pattern_utils/src/engine/BasicMaterial"
import * as Transform from "splice_pattern_utils/src/engine/Transform"
import { state } from "./MainStateType"
import { createFakeWebGLRenderingContext } from "splice_pattern_utils/src/engine/FakeGL"
import { Map } from "immutable"
import * as API from "splice_pattern_utils/src/engine/API"
import * as InitBasicMaterialShader from "./InitBasicMaterialShader"
import * as Render from "./Render"

export let createState = (): state => {
    return {
        gl: createFakeWebGLRenderingContext(),
        programMap: Map(),
        maxShaderIndex: 0,
        shaderIndexMap: Map(),
        vMatrix: null,
        pMatrix: null,
        isSupportInstance: true,
        maxDirectionLightCount: 4,

        basicMaterialState: BasicMaterial.createState(),
        transformState: Transform.createState()
    }
}

export let createTransform = API.createTransform

export let setFakeTransformData = API.setFakeTransformData

export let createMaterial = API.createMaterial

export let setMaterialFakeColor = API.setMaterialFakeColor

export let setMaterialFakeMap = API.setMaterialFakeMap

export let initCamera = API.initCamera

export let initBasicMaterialShader = InitBasicMaterialShader.initBasicMaterialShader

export let render = Render.render