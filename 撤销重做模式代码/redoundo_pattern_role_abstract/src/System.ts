import { Stack } from "immutable"
import { pushAllStates, undo as undoRedoUndoManager, redo as redoRedoUndoManager } from "./RedoUndoManager"
import * as SubSystem1 from "./SubSystem1"

export type state = {
    subSystem1StatesForUndo: Stack<SubSystem1.state>,
    subSystem1StatesForRedo: Stack<SubSystem1.state>,
    subSystem1State: SubSystem1.state,
}

export let createState = (): state => {
    return {
        subSystem1StatesForUndo: Stack(),
        subSystem1StatesForRedo: Stack(),
        subSystem1State: SubSystem1.createState(),
    }
}

export let operate1 = (state: state) => {
    state = pushAllStates(state)

    let subSystem1State = SubSystem1.doWhenOperate1(state.subSystem1State)

    return {
        ...state,
        subSystem1State
    }
}

export let undo = (state: state) => {
    return undoRedoUndoManager(state)
}

export let redo = (state: state) => {
    return redoRedoUndoManager(state)
}