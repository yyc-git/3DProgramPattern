//所有字段都是不可变的
export type state = {
    data1: number
}

export let createState = (): state => {
    return {
        data1: 0
    }
}

export let doWhenMove = (state: state) => {
    return {
        ...state,
        data1: state.data1 + 3
    }
}