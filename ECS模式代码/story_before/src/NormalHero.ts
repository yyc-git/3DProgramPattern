import { generateId } from "./IdUtils";
import { state as normalHeroState, hero as normalHero } from "./NormalHeroStateType";
import { state as worldState } from "./WorldStateType";
import { getNormalHeroState, setNormalHeroState } from "./WorldUtils";

export let create = (): [normalHeroState, normalHero] => {
    let normalHeroState: normalHeroState = {
        position: [0, 0, 0],
        velocity: 1.0
    }

    let id = generateId()

    return [
        normalHeroState,
        id
    ]
}

export let update = (normalHeroState: normalHeroState): normalHeroState => {
    console.log("更新NormalHero")

    let [x, y, z] = normalHeroState.position

    //更新position
    let newPosition: [number, number, number] = [x * 2.0, y * 2.0, z * 2.0]

    return {
        ...normalHeroState,
        position: newPosition
    }
}

export let move = (worldState: worldState, normalHero: normalHero): worldState => {
    let normalHeroState = getNormalHeroState(worldState, normalHero)

    let { position, velocity } = normalHeroState

    let [x, y, z] = position

    return setNormalHeroState(worldState, normalHero,
        {
            ...normalHeroState,
            position: [x + velocity, y + velocity, z + velocity]
        }
    )
}