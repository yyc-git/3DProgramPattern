import { pushCommand, undo as undoCommandManager, redo as redoCommandManager } from "./CommandManager"
import { createCommand } from "./MoveCommand"
import * as Engine from "./Engine"
import * as EditorLogic from "./EditorLogic"
import * as EditorUI from "./EditorUI"

export let printAllData = () => {
    console.log("Engine->data1:", Engine.getData1())
    console.log("EditorLogic->data1:", EditorLogic.getData1())
    console.log("EditorUI->data1:", EditorUI.getData1())
}

export let move = () => {
    console.log("move")

    let moveCommand = createCommand()

    pushCommand(moveCommand)

    moveCommand.exec()
}

export let undo = () => {
    console.log("undo")

    undoCommandManager()
}

export let redo = () => {
    console.log("redo")

    redoCommandManager()
}