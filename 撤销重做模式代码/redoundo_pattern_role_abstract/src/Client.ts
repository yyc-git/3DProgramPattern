import * as System from "./System";

let state = System.createState()

state = System.doSomething(state)

state = System.undo(state)

state = System.redo(state)
