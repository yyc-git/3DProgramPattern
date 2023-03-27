import { hasBasicMap } from "./BasicMaterial"
import { state } from "./BasicMaterialStateType"

export let isNameValidForStaticBranch = (name) => {
    switch (name) {
        case "modelMatrix_instance":
            return true
        default:
            return false
    }
}

export let getShaderLibFromStaticBranch = (state: state, name, value) => {
    switch (name) {
        case "modelMatrix_instance":
            if (state.isSupportHardwareInstance) {
                return value[1]
            }
            else if (state.isSupportBatchInstance) {
                return value[2]
            }
            else {
                return value[0]
            }
        default:
            throw new Error("unknown name: " + name)
    }
}

export let isPassForDynamicBranch = (material, state: state, condition) => {
    switch (condition) {
        case "basic_has_map":
            return hasBasicMap(material, state)
        default:
            throw new Error("unknown condition: " + condition)
    }
}