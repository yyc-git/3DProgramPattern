let _data1: number = 0

export let getData1 = () => {
    return _data1
}

export let setData1 = (data1) => {
    _data1 = data1
}

export let draw = () => {
    console.log("operate dom to draw")
}

export let undraw = () => {
    console.log("operate dom to undraw")
}

export let doWhenMove = () => {
    _data1 += 3

    draw()
}