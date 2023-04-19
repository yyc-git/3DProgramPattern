import { state as normalHeroState, hero as normalHero } from "./NormalHeroStateType";
import { state as superHeroState, hero as superHero } from "./SuperHeroStateType";
import { state as worldState } from "./WorldStateType";

export let getNormalHeroState = (worldState: worldState, normalHero: normalHero): normalHeroState => {
    return worldState.normalHeroes.get(normalHero)
}

export let setNormalHeroState = (worldState: worldState, normalHero: normalHero, normalHeroState: normalHeroState) => {
    return {
        ...worldState,
        normalHeroes: worldState.normalHeroes.set(normalHero, normalHeroState)
    }
}

export let getSuperHeroState = (worldState: worldState, superHero: superHero): superHeroState => {
    return worldState.superHeroes.get(superHero)
}


export let setSuperHeroState = (worldState: worldState, superHero: superHero, superHeroState: superHeroState) => {
    return {
        ...worldState,
        superHeroes: worldState.superHeroes.set(superHero, superHeroState)
    }
}
