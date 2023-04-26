//所有字段都是immutable
export type state = {
    immutable数据: xxx,
}

export let createState = (): state => {
    return {
        immutable数据: 初始值1,
    }
}

export let doSomething = (state: state) => {
    return {
        ...state,
        immutable数据: 更新immutable数据(state.immutable数据)
    }
}