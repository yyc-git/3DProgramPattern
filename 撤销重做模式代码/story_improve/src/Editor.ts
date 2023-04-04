import { Stack } from "immutable"
import { pushAllSubSystemStates, undo as undoRedoUndoManager, redo as redoRedoUndoManager } from "./RedoUndoManager"
import * as Engine from "./Engine"
import * as EditorLogic from "./EditorLogic"
import * as EditorUI from "./EditorUI"

export type state = {
    engineStatesForUndo: Stack<Engine.state>,
    engineStatesForRedo: Stack<Engine.state>,
    editorLogicStatesForUndo: Stack<EditorLogic.state>,
    editorLogicStatesForRedo: Stack<EditorLogic.state>,
    editorUIStatesForUndo: Stack<EditorUI.state>,
    editorUIStatesForRedo: Stack<EditorUI.state>,
    engineState: Engine.state,
    editorLogicState: EditorLogic.state,
    editorUIState: EditorUI.state
}

export let createState = (): state => {
    return {
        engineStatesForUndo: Stack(),
        engineStatesForRedo: Stack(),
        editorLogicStatesForUndo: Stack(),
        editorLogicStatesForRedo: Stack(),
        editorUIStatesForUndo: Stack(),
        editorUIStatesForRedo: Stack(),
        engineState: Engine.createState(),
        editorLogicState: EditorLogic.createState(),
        editorUIState: EditorUI.createState()
    }
}

export let printAllData = ({ engineState, editorLogicState, editorUIState }: state) => {
    console.log("Engine->state:", engineState)
    console.log("EditorLogic->state:", editorLogicState)
    console.log("EditorUI->state:", editorUIState)
}

export let move = (state: state) => {
    console.log("move")

    state = pushAllSubSystemStates(state)

    let engineState = Engine.doWhenMove(state.engineState)
    let editorLogicState = EditorLogic.doWhenMove(state.editorLogicState)
    let editorUIState = EditorUI.doWhenMove(state.editorUIState)

    return {
        ...state,
        engineState,
        editorLogicState,
        editorUIState
    }
}

export let undo = (state: state) => {
    console.log("undo")

    return undoRedoUndoManager(state)
}

export let redo = (state: state) => {
    console.log("redo")

    return redoRedoUndoManager(state)
}