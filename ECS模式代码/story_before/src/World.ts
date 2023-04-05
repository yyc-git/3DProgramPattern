import { state as worldState } from "./WorldStateType";
// import { create, update as updateNormalHero } from "./NormalHero"
// import { update as updateSuperHero } from "./SuperHero"
import * as NormalHero from "./NormalHero";
import * as SuperHero from "./SuperHero";
import { Map } from "immutable"
import { setNormalHeroState, setSuperHeroState } from "./WorldUtils";

export let createState = (): worldState => {
    return {
        normalHeros: Map(),
        superHeros: Map()
    }
}

export let addNormalHero = (worldState: worldState, [normalHeroState, normalHero]): worldState => {
    return setNormalHeroState(worldState, normalHero, normalHeroState)
}

export let addSuperHero = (worldState: worldState, [superHeroState, superHero]): worldState => {
    return setSuperHeroState(worldState, superHero, superHeroState)
}

let _update = (worldState: worldState): worldState => {
    return {
        normalHeros: worldState.normalHeros.map(normalHeroState => {
            return NormalHero.update(normalHeroState)
        }),
        superHeros: worldState.superHeros.map(superHeroState => {
            return SuperHero.update(superHeroState)
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

    console.log(JSON.stringify(worldState))

    requestAnimationFrame(
        (time) => {
            loop(worldState)
        }
    )
}

export let api = {
    normalHero: {
        create: NormalHero.create,
        move: NormalHero.move
    },
    superHero: {
        create: SuperHero.create,
        move: SuperHero.move,
        fly: SuperHero.fly
    }
}