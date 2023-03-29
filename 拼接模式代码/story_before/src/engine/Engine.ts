import * as BasicMaterial from "./BasicMaterial"
import * as Transform from "./Transform"
import { state } from "./MainStateType"
import { createFakeWebGLRenderingContext } from "./FakeGL"
import { Map } from "immutable"
import * as API from "./API"

export let createState = (): state => {
    return {
        gl: createFakeWebGLRenderingContext(),
        programMap: Map(),
        maxShaderIndex: 0,
        vMatrix: null,
        pMatrix: null,
        isSupportHardwareInstance: true,
        isSupportBatchInstance: false,
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

export let initBasicMaterialShader = API.initBasicMaterialShader

export let initCamera = API.initCamera

export let render = API.render