export let init = (worldState) => {
    console.log("初始化...")

    return worldState
}

//假实现
let requestAnimationFrame = (func) => {
}

export let loop = (worldState, [update, renderOneByOne, renderInstances]) => {
    worldState = update(worldState)
    renderOneByOne(worldState)
    renderInstances(worldState)

    console.log(JSON.stringify(worldState))

    requestAnimationFrame(
        (time) => {
            loop(worldState, [update, renderOneByOne, renderInstances])
        }
    )
}