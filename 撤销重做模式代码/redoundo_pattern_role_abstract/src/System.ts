import { Stack } from "immutable"
import { pushAllSubSystemStates, undo as undoRedoUndoManager, redo as redoRedoUndoManager } from "./RedoUndoManager"
import * as ImmutableAndMutableSubSystem1 from "./ImmutableAndMutableSubSystem1"
import * as ImmutableSubSystem1 from "./ImmutableSubSystem1"

export type state = {
    immutableAndMutableSubSystem1StatesForUndo: Stack<ImmutableAndMutableSubSystem1.state>,
    immutableAndMutableSubSystem1StatesForRedo: Stack<ImmutableAndMutableSubSystem1.state>,
    immutableSubSystem1StatesForUndo: Stack<ImmutableSubSystem1.state>,
    immutableSubSystem1StatesForRedo: Stack<ImmutableSubSystem1.state>,
    immutableAndMutableSubSystem1State: ImmutableAndMutableSubSystem1.state,
    immutableSubSystem1State: ImmutableSubSystem1.state,
}

export let createState = (): state => {
    return {
        immutableAndMutableSubSystem1StatesForUndo: Stack(),
        immutableAndMutableSubSystem1StatesForRedo: Stack(),
        immutableSubSystem1StatesForUndo: Stack(),
        immutableSubSystem1StatesForRedo: Stack(),
        immutableAndMutableSubSystem1State: ImmutableAndMutableSubSystem1.createState(),
        immutableSubSystem1State: ImmutableSubSystem1.createState(),
    }
}

export let doSomething = (state: state) => {
    state = pushAllSubSystemStates(state)

    let immutableAndMutableSubSystem1State = ImmutableAndMutableSubSystem1.doSomething(state.immutableAndMutableSubSystem1State)

    let immutableSubSystem1State = ImmutableSubSystem1.doSomething(state.immutableSubSystem1State)

    return {
        ...state,
        immutableAndMutableSubSystem1State,
        immutableSubSystem1State
    }
}

export let undo = (state: state) => {
    return undoRedoUndoManager(state)
}

export let redo = (state: state) => {
    return redoRedoUndoManager(state)
}