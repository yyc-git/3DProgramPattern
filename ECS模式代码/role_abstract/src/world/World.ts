import { state as worldState } from "../world/WorldStateType";
import * as CreateStateSystem from "../system/CreateStateSystem"
import * as System1 from "../system/System1"

export let createState = CreateStateSystem.createState

export let operateGameObjectAndComponentsFunc1 = System1.operateGameObjectAndComponentsFunc1

export let init = (worldState: worldState): worldState => {
    console.log("初始化...")

    return worldState
}


//假实现
let requestAnimationFrame = (func) => {
}


export let loop = (worldState: worldState) => {
    调用其它System来update

    调用其它System来render

    requestAnimationFrame(
        (time) => {
            loop(worldState)
        }
    )
}