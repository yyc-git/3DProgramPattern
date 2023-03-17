import { state as worldState } from "./WorldStateType";
import { update as updateNormalHero } from "./NormalHero"
import { update as updateSuperHero } from "./SuperHero"
import { Map } from "immutable"

export let createState = (): worldState => {
    return {
        normalHeros: Map(),
        superHeros: Map()
    }
}

let _update = (worldState: worldState): worldState => {
    return {
        normalHeros: worldState.normalHeros.map(normalHeroState => {
            return updateNormalHero(normalHeroState)
        }),
        superHeros: worldState.superHeros.map(superHeroState => {
            return updateSuperHero(superHeroState)
        })
    }
}

let _renderOneByOne = (worldState: worldState): void => {
    worldState.superHeros.forEach(superHeroState => {
        console.log("OneByOne渲染 SuperHero...")
    })
}

let _renderInstances = (worldState: worldState): void => {
    let normalHeroStates = worldState.normalHeros

    console.log("批量Instance渲染 NormalHeros...")
}

export let init = (worldState: worldState): worldState => {
    console.log("初始化...")

    return worldState
}


//假实现
let requestAnimationFrame = (func) => {
}


export let loop = (worldState: worldState) => {
    worldState = _update(worldState)
    _renderOneByOne(worldState)
    _renderInstances(worldState)

    // console.log(JSON.stringify(worldState))

    requestAnimationFrame(
        (time) => {
            loop(worldState)
        }
    )
}
