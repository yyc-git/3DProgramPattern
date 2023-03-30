import { command } from "./CommandType";

let _commandsForUndo: Array<command> = []

let _commandsForRedo: Array<command> = []

export let pushCommand = (command: command) => {
    _commandsForUndo.push(command)
    _commandsForRedo = []
}

export let undo = () => {
    let command = _commandsForUndo.pop()

    _commandsForRedo.push(command)

    command.undo()
}

export let redo = () => {
    if (_commandsForRedo.length === 0) {
        console.log("do nothing")
        return
    }

    let command = _commandsForRedo.pop()

    _commandsForUndo.push(command)

    command.exec()
}