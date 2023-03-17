import { state as normalHeroState } from "./NormalHeroStateType"
import { state as superHeroState } from "./SuperHeroStateType"

export type state = {
    normalHeros: Array<normalHeroState>,
    superHeros: Array<superHeroState>
}