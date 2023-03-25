import { Stack } from "immutable"
import * as ImmutableAndMutableSubSystem1 from "./ImmutableAndMutableSubSystem1"
import * as System from "./System"

export let pushAllStates = (systemState: System.state): System.state => {
    return {
        ...systemState,
        immutableAndMutableSubSystem1StatesForUndo: systemState.immutableAndMutableSubSystem1StatesForUndo.push(
            ImmutableAndMutableSubSystem1.deepCopy(systemState.immutableAndMutableSubSystem1State)
        ),
        immutableSubSystem1StatesForUndo: systemState.immutableSubSystem1StatesForUndo.push(
            systemState.immutableSubSystem1State
        ),
        immutableAndMutableSubSystem1StatesForRedo: Stack(),
        immutableSubSystem1StatesForRedo: Stack(),
    }
}

export let undo = (systemState: System.state): System.state => {
    let previousImmutableAndMutableSubSystem1State = systemState.immutableAndMutableSubSystem1StatesForUndo.first()
    let immutableAndMutableSubSystem1StatesForUndo = systemState.immutableAndMutableSubSystem1StatesForUndo.pop()

    let immutableAndMutableSubSystem1StatesForRedo = systemState.immutableAndMutableSubSystem1StatesForRedo.push(ImmutableAndMutableSubSystem1.deepCopy(systemState.immutableAndMutableSubSystem1State))

    previousImmutableAndMutableSubSystem1State = ImmutableAndMutableSubSystem1.restore(systemState.immutableAndMutableSubSystem1State, previousImmutableAndMutableSubSystem1State)



    let previousImmutableSubSystem1State = systemState.immutableSubSystem1StatesForUndo.first()
    let immutableSubSystem1StatesForUndo = systemState.immutableSubSystem1StatesForUndo.pop()

    let immutableSubSystem1StatesForRedo = systemState.immutableSubSystem1StatesForRedo.push(systemState.immutableSubSystem1State)


    return {
        ...systemState,
        immutableAndMutableSubSystem1StatesForUndo,
        immutableSubSystem1StatesForUndo,
        immutableAndMutableSubSystem1StatesForRedo,
        immutableSubSystem1StatesForRedo,

        immutableAndMutableSubSystem1State: previousImmutableAndMutableSubSystem1State,
        immutableSubSystem1State: previousImmutableSubSystem1State
    }
}

export let redo = (systemState: System.state): System.state => {
    if (systemState.immutableAndMutableSubSystem1StatesForRedo.size === 0) {
        console.log("do nothing")

        return systemState
    }

    let nextImmutableAndMutableSubSystem1State = systemState.immutableAndMutableSubSystem1StatesForRedo.first()
    let immutableAndMutableSubSystem1StatesForRedo = systemState.immutableAndMutableSubSystem1StatesForRedo.pop()

    let immutableAndMutableSubSystem1StatesForUndo = systemState.immutableAndMutableSubSystem1StatesForUndo.push(ImmutableAndMutableSubSystem1.deepCopy(systemState.immutableAndMutableSubSystem1State))

    nextImmutableAndMutableSubSystem1State = ImmutableAndMutableSubSystem1.restore(systemState.immutableAndMutableSubSystem1State, nextImmutableAndMutableSubSystem1State)




    let nextImmutableSubSystem1State = systemState.immutableSubSystem1StatesForRedo.first()
    let immutableSubSystem1StatesForRedo = systemState.immutableSubSystem1StatesForRedo.pop()

    let immutableSubSystem1StatesForUndo = systemState.immutableSubSystem1StatesForUndo.push(systemState.immutableSubSystem1State)


    return {
        ...systemState,
        immutableAndMutableSubSystem1StatesForUndo,
        immutableSubSystem1StatesForUndo,
        immutableAndMutableSubSystem1StatesForRedo,
        immutableSubSystem1StatesForRedo,

        immutableAndMutableSubSystem1State: nextImmutableAndMutableSubSystem1State,
        immutableSubSystem1State: nextImmutableSubSystem1State
    }
}