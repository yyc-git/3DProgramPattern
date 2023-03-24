import { createState, operate1, redo, undo } from "./System";

let state = createState()

state = operate1(state)

state = undo(state)

state = redo(state)
