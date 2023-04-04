//一些字段是immutable，另外的字段是mutable
export type state = {
    immutableData1: number,
    mutableData2: Array<number>
}

export let createState = (): state => {
    return {
        immutableData1: 0,
        mutableData2: [1]
    }
}

export let doWhenMove = (state: state) => {
    state = {
        ...state,
        immutableData1: state.immutableData1 + 1
    }

    //更新mutable字段
    //并没有像更新immutable数据那样拷贝后再修改，而是直接修改了原始数据
    state.mutableData2.push(1)

    return state
}

//深拷贝mutable的字段
export let deepCopy = (state: state): state => {
    return {
        ...state,
        mutableData2: state.mutableData2.slice()
    }
}

export let restore = (currentState: state, targetState: state): state => {
    return targetState
}