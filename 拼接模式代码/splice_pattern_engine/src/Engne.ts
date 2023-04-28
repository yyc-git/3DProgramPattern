import * as GameObject from "splice_pattern_utils/src/engine/GameObject"
import * as BasicMaterial from "splice_pattern_utils/src/engine/BasicMaterial"
import * as PBRMaterial from "splice_pattern_utils/src/engine/PBRMaterial"
import * as Transform from "splice_pattern_utils/src/engine/Transform"
import * as ChunkHandler from "chunk_handler"
import { state } from "./EngneStateType"
import { createFakeWebGLRenderingContext } from "splice_pattern_utils/src/engine/FakeGL"
import { getData } from "./glsl/MergedGLSLChunk"
import { Map } from "immutable"
import * as API from "splice_pattern_utils/src/engine/API"
import * as InitMaterialShader from "./InitMaterialShader"
import * as Render from "./Render"

export let parseConfig = ChunkHandler.parseConfig

export let createState = ([shaders, shaderChunks]): state => {
    return {
        gl: createFakeWebGLRenderingContext(),
        programMap: Map(),
        sendConfigMap: Map(),
        basicMaterialShaderIndexMap: Map(),
        pbrMaterialShaderIndexMap: Map(),
        maxShaderIndex: 0,
        vMatrix: null,
        pMatrix: null,
        shaders,
        shaderChunks,
        isSupportInstance: true,
        maxDirectionLightCount: 4,
        chunk: getData(),
        precision: "lowp",

        gameObjectState: GameObject.createState(),
        basicMaterialState: BasicMaterial.createState(),
        pbrMaterialState: PBRMaterial.createState(),
        transformState: Transform.createState()
    }
}

export let createTransform = API.createTransform

export let setFakeTransformData = API.setFakeTransformData

export let initCamera = API.initCamera

export let initBasicMaterialShader = InitMaterialShader.initBasicMaterialShader

export let initPBRMaterialShader = InitMaterialShader.initPBRMaterialShader

export let render = Render.render