import { state as basicMaterialState } from "./BasicMaterialStateType"

export type state = {
    shadersJson: JSON,
    shaderLibsJson: JSON,
    basicMaterialState: basicMaterialState
}