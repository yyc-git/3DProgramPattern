import { state as normalHeroState, hero as normalHero } from "./NormalHeroStateType";
import { state as superHeroState, hero as superHero } from "./SuperHeroStateType";
import { state as worldState } from "./WorldStateType";

export let getNormalHeroState = (worldState: worldState, normalHero: normalHero): normalHeroState => {
    return worldState.normalHeros.get(normalHero)
}

export let setNormalHeroState = (worldState: worldState, normalHero: normalHero, normalHeroState: normalHeroState) => {
    return {
        ...worldState,
        normalHeros: worldState.normalHeros.set(normalHero, normalHeroState)
    }
}

export let getSuperHeroState = (worldState: worldState, superHero: superHero): superHeroState => {
    return worldState.superHeros.get(superHero)
}


export let setSuperHeroState = (worldState: worldState, superHero: superHero, superHeroState: superHeroState) => {
    return {
        ...worldState,
        superHeros: worldState.superHeros.set(superHero, superHeroState)
    }
}
