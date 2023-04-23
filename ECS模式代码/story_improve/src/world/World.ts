import * as CreateStateSystem from "../system/CreateStateSystem"
import * as MoveSystem from "../system/MoveSystem"
import * as FlySystem from "../system/FlySystem"
import * as UpdateSystem from "../system/UpdateSystem"
import * as RenderOneByOneSystem from "../system/RenderOneByOneSystem"
import * as RenderInstancesSystem from "../system/RenderInstancesSystem"

export let createState = CreateStateSystem.createState

export let move = MoveSystem.move

export let fly = FlySystem.fly

export let update = UpdateSystem.update

export let renderOneByOne = RenderOneByOneSystem.render

export let renderInstances = RenderInstancesSystem.render