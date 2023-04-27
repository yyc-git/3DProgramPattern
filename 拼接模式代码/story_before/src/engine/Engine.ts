import * as GameObject from "splice_pattern_utils/src/engine/GameObject"
import * as BasicMaterial from "splice_pattern_utils/src/engine/BasicMaterial"
import * as PBRMaterial from "splice_pattern_utils/src/engine/PBRMaterial"
import * as Transform from "splice_pattern_utils/src/engine/Transform"
import { state } from "./EngineStateType"
import { createFakeWebGLRenderingContext } from "splice_pattern_utils/src/engine/FakeGL"
import { Map } from "immutable"
import * as API from "splice_pattern_utils/src/engine/API"
import * as InitBasicMaterialShader from "./InitBasicMaterialShader"
import * as InitPBRMaterialShader from "./InitPBRMaterialShader"
import * as Render from "./Render"

export let createState = (): state => {
    return {
        gl: createFakeWebGLRenderingContext(),
        programMap: Map(),
        maxShaderIndex: 0,
        basicMaterialShaderIndexMap: Map(),
        pbrMaterialShaderIndexMap: Map(),
        vMatrix: null,
        pMatrix: null,
        isSupportInstance: true,
        maxDirectionLightCount: 4,

        gameObjectState: GameObject.createState(),
        basicMaterialState: BasicMaterial.createState(),
        pbrMaterialState: PBRMaterial.createState(),
        transformState: Transform.createState()
    }
}

export let createTransform = API.createTransform

export let setFakeTransformData = API.setFakeTransformData

export let initCamera = API.initCamera

export let initBasicMaterialShader = InitBasicMaterialShader.initBasicMaterialShader

export let initPBRMaterialShader = InitPBRMaterialShader.initPBRMaterialShader

export let render = Render.render