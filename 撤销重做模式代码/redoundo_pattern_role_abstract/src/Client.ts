import { createState, doSomething, redo, undo } from "./System";

let state = createState()

state = doSomething(state)

state = undo(state)

state = redo(state)
