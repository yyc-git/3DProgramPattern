import * as Editor from "./Editor";

let state = Editor.createState()

Editor.printAllData(state)

state = Editor.move(state)

Editor.printAllData(state)

state = Editor.undo(state)

Editor.printAllData(state)

// state = move(state)
// printAllData(state)

state = Editor.redo(state)

Editor.printAllData(state)
