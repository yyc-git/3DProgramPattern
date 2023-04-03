import * as Engine from "./Engine"
import * as EditorLogic from "./EditorLogic"
import * as EditorUI from "./EditorUI"
import { command } from "./Command"

let _engineData1Before: number
let _editorLogicData1Before: number
let _editorUIData1Before: number

export let createCommand = (): command => {
    return {
        exec: () => {
            _engineData1Before = Engine.getData1()
            _editorLogicData1Before = EditorLogic.getData1()
            _editorUIData1Before = EditorUI.getData1()

            Engine.doWhenMove()
            EditorLogic.doWhenMove()
            EditorUI.doWhenMove()
        },
        undo: () => {
            Engine.setData1(_engineData1Before)
            EditorLogic.setData1(_editorLogicData1Before)
            EditorUI.setData1(_editorUIData1Before)

            EditorUI.undraw()
        }
    }
}