//一些字段是immutable，另外的字段是mutable
export type state = {
    immutable数据: xxx,
    mutable数据: xxx
}

export let createState = (): state => {
    return {
        immutable数据: 初始值1,
        mutable数据: 初始值2
    }
}

export let doSomething = (state: state) => {
    state = {
        ...state,
        immutable数据: 更新immutable数据(state.immutable数据)
    }

    更新mutable数据(state.mutable数据)

    return state
}

export let deepCopy = (state: state): state => {
    return {
        ...state,
        mutable数据: 深拷贝(state.mutable数据)
    }
}

export let restore = (currentState: state, targetState: state): state => {
    console.log("处理currentState中与targetState共享的可变数据（如图形API的对象：WebGLBuffer），然后将处理结果重新共享到targetState")

    return targetState
}