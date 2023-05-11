//一些字段是不可变的，另外的字段是可变的
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
    //更新不可变字段
    //先拷贝state，再修改拷贝后的state中的对应字段
    state = {
        ...state,
        immutableData1: state.immutableData1 + 1
    }

    //更新可变字段
    //直接修改原始数据
    state.mutableData2.push(1)

    return state
}

//深拷贝可变字段
export let deepCopy = (state: state): state => {
    return {
        ...state,
        mutableData2: state.mutableData2.slice()
    }
}

export let restore = (currentState: state, targetState: state): state => {
    return targetState
}