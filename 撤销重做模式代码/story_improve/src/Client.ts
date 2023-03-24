import {createState, move, printAllData, redo, undo } from "./Editor";

let state =  createState()

printAllData(state)

state = move(state)

printAllData(state)

state = undo(state)

printAllData(state)

// state = move(state)
// printAllData(state)

state = redo(state)

printAllData(state)
