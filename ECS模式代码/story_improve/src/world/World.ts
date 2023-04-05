import { state as worldState } from "../world/WorldStateType";
import * as CreateStateSystem from "../system/CreateStateSystem"
import * as MoveSystem from "../system/MoveSystem"
import * as FlySystem from "../system/FlySystem"
import * as UpdateSystem from "../system/UpdateSystem"
import * as RenderOneByOneSystem from "../system/RenderOneByOneSystem"
import * as RenderInstancesSystem from "../system/RenderInstancesSystem"

export let createState = CreateStateSystem.createState

export let move = MoveSystem.move

export let fly = FlySystem.fly

export let init = (worldState: worldState): worldState => {
    console.log("初始化...")

    return worldState
}


//假实现
let requestAnimationFrame = (func) => {
}


export let loop = (worldState: worldState) => {
    worldState = UpdateSystem.update(worldState)
    RenderOneByOneSystem.render(worldState)
    RenderInstancesSystem.render(worldState)

    console.log(JSON.stringify(worldState))

    requestAnimationFrame(
        (time) => {
            loop(worldState)
        }
    )
}