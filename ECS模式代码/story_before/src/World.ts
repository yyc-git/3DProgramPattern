import { state as worldState } from "./WorldStateType";
import * as NormalHero from "./NormalHero";
import * as SuperHero from "./SuperHero";
import { Map } from "immutable"
import { setNormalHeroState, setSuperHeroState } from "./WorldUtils";

export let createState = (): worldState => {
    return {
        normalHeroes: Map(),
        superHeroes: Map()
    }
}

export let addNormalHero = (worldState: worldState, [normalHeroState, normalHero]): worldState => {
    return setNormalHeroState(worldState, normalHero, normalHeroState)
}

export let addSuperHero = (worldState: worldState, [superHeroState, superHero]): worldState => {
    return setSuperHeroState(worldState, superHero, superHeroState)
}

export let update = (worldState: worldState): worldState => {
    return {
        normalHeroes: worldState.normalHeroes.map(normalHeroState => {
            return NormalHero.update(normalHeroState)
        }),
        superHeroes: worldState.superHeroes.map(superHeroState => {
            return SuperHero.update(superHeroState)
        })
    }
}

export let renderOneByOne = (worldState: worldState): void => {
    worldState.superHeroes.forEach(superHeroState => {
        console.log("OneByOne渲染 SuperHero...")
    })
}

export let renderInstances = (worldState: worldState): void => {
    let normalHeroStates = worldState.normalHeroes

    console.log("批量Instance渲染 NormalHeroes...")
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