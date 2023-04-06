import { state as worldState } from "../world/WorldStateType";
import * as CreateStateSystem from "../system/CreateStateSystem"
import * as OtherSystem1 from "../system/OtherSystem1"

export let createState = CreateStateSystem.createState

export let action1 = OtherSystem1.action

export let init = (worldState: worldState): worldState => {
    console.log("初始化...")

    return worldState
}


//假实现
let requestAnimationFrame = (func) => {
}


export let loop = (worldState: worldState) => {
    调用System来update

    调用System来render

    requestAnimationFrame(
        (time) => {
            loop(worldState)
        }
    )
}