import { Stack } from "immutable"
import * as Engine from "./Engine"
import * as Editor from "./Editor"

export let pushAllSubSystemStates = (editorState: Editor.state): Editor.state => {
    return {
        ...editorState,
        engineStatesForUndo: editorState.engineStatesForUndo.push(
            Engine.deepCopy(editorState.engineState)
        ),
        editorLogicStatesForUndo: editorState.editorLogicStatesForUndo.push(editorState.editorLogicState),
        editorUIStatesForUndo: editorState.editorUIStatesForUndo.push(editorState.editorUIState),
        engineStatesForRedo: Stack(),
        editorLogicStatesForRedo: Stack(),
        editorUIStatesForRedo: Stack()
    }
}

export let undo = (editorState: Editor.state): Editor.state => {
    let previousEngineState = editorState.engineStatesForUndo.first()
    let engineStatesForUndo = editorState.engineStatesForUndo.pop()

    //深拷贝
    let engineStatesForRedo = editorState.engineStatesForRedo.push(Engine.deepCopy(editorState.engineState))

    //恢复
    previousEngineState = Engine.restore(editorState.engineState, previousEngineState)



    let previousEditorLogicState = editorState.editorLogicStatesForUndo.first()
    let editorLogicStatesForUndo = editorState.editorLogicStatesForUndo.pop()

    let editorLogicStatesForRedo = editorState.editorLogicStatesForRedo.push(editorState.editorLogicState)




    let previousEditorUIState = editorState.editorUIStatesForUndo.first()
    let editorUIStatesForUndo = editorState.editorUIStatesForUndo.pop()

    let editorUIStatesForRedo = editorState.editorUIStatesForRedo.push(editorState.editorUIState)




    return {
        ...editorState,
        engineStatesForUndo,
        editorLogicStatesForUndo,
        editorUIStatesForUndo,
        engineStatesForRedo,
        editorLogicStatesForRedo,
        editorUIStatesForRedo,

        //替换当前子系统各个模块的state
        engineState: previousEngineState,
        editorLogicState: previousEditorLogicState,
        editorUIState: previousEditorUIState
    }
}

export let redo = (editorState: Editor.state): Editor.state => {
    if (editorState.engineStatesForRedo.size === 0) {
        console.log("do nothing")

        return editorState
    }

    let nextEngineState = editorState.engineStatesForRedo.first()
    let engineStatesForRedo = editorState.engineStatesForRedo.pop()

    //深拷贝
    let engineStatesForUndo = editorState.engineStatesForUndo.push(Engine.deepCopy(editorState.engineState))

    //恢复
    nextEngineState = Engine.restore(editorState.engineState, nextEngineState)



    let nextEditorLogicState = editorState.editorLogicStatesForRedo.first()
    let editorLogicStatesForRedo = editorState.editorLogicStatesForRedo.pop()

    let editorLogicStatesForUndo = editorState.editorLogicStatesForUndo.push(editorState.editorLogicState)



    let nextEditorUIState = editorState.editorUIStatesForRedo.first()
    let editorUIStatesForRedo = editorState.editorUIStatesForRedo.pop()

    let editorUIStatesForUndo = editorState.editorUIStatesForUndo.push(editorState.editorUIState)


    return {
        ...editorState,
        engineStatesForUndo,
        editorLogicStatesForUndo,
        editorUIStatesForUndo,
        engineStatesForRedo,
        editorLogicStatesForRedo,
        editorUIStatesForRedo,

        //替换当前子系统各个模块的state
        engineState: nextEngineState,
        editorLogicState: nextEditorLogicState,
        editorUIState: nextEditorUIState
    }
}