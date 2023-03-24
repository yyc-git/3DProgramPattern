import { Stack } from "immutable"
import * as SubSystem1 from "./SubSystem1"
import * as System from "./System"

export let pushAllStates = (editorState: System.state): System.state => {
    return {
        ...editorState,
        subSystem1StatesForUndo: editorState.subSystem1StatesForUndo.push(
            SubSystem1.deepCopy(editorState.subSystem1State)
        ),
        subSystem1StatesForRedo: Stack(),
    }
}

export let undo = (editorState: System.state): System.state => {
    let previousSubSystem1State = editorState.subSystem1StatesForUndo.first()
    let subSystem1StatesForUndo = editorState.subSystem1StatesForUndo.pop()

    let subSystem1StatesForRedo = editorState.subSystem1StatesForRedo.push(SubSystem1.deepCopy(editorState.subSystem1State))

    previousSubSystem1State = SubSystem1.restore(editorState.subSystem1State, previousSubSystem1State)


    return {
        ...editorState,
        subSystem1StatesForUndo,
        subSystem1StatesForRedo,

        subSystem1State: previousSubSystem1State
    }
}

export let redo = (editorState: System.state): System.state => {
    if (editorState.subSystem1StatesForRedo.size === 0) {
        console.log("do nothing")

        return editorState
    }

    let nextSubSystem1State = editorState.subSystem1StatesForRedo.first()
    let subSystem1StatesForRedo = editorState.subSystem1StatesForRedo.pop()

    let subSystem1StatesForUndo = editorState.subSystem1StatesForUndo.push(SubSystem1.deepCopy(editorState.subSystem1State))

    nextSubSystem1State = SubSystem1.restore(editorState.subSystem1State, nextSubSystem1State)


    return {
        ...editorState,
        subSystem1StatesForUndo,
        subSystem1StatesForRedo,

        subSystem1State: nextSubSystem1State
    }
}