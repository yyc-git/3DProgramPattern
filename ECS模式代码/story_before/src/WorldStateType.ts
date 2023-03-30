import type { Map } from "immutable"
import { state as normalHeroState, hero as normalHero } from "./NormalHeroStateType"
import { state as superHeroState, hero as superHero } from "./SuperHeroStateType"

export type state = {
    normalHeros: Map<normalHero, normalHeroState>,
    superHeros: Map<superHero, superHeroState>
}