import { state as normalHeroState, hero as normalHero } from "./NormalHeroStateType";
import { state as worldState } from "./WorldStateType";

let _getNormalHeroState = (worldState: worldState, normalHero: normalHero) => {
    return worldState.normalHeros[normalHero]
}


let _setNormalHeroState = (worldState: worldState, normalHero: normalHero, normalHeroState: normalHeroState) => {
    let normalHeros = worldState.normalHeros.slice()
    normalHeros[normalHero] = normalHeroState

    return {
        ...worldState,
        normalHeros: normalHeros
    }
}

export let create = (worldState: worldState): [worldState, normalHero] => {
    let normalHeroState: normalHeroState = {
        position: [0, 0, 0],
        velocity: 1.0
    }

    let id = worldState.normalHeros.length

    return [
        _setNormalHeroState(worldState, id, normalHeroState),
        id
    ]
}

export let update = (normalHeroState: normalHeroState): normalHeroState => {
    console.log("更新NormalHero")

    let [x, y, z] = normalHeroState.position

    //更新position（如更新世界坐标系中的position）...
    let newPosition: [number, number, number] = [x * 2.0, y * 2.0, z * 2.0]

    return {
        ...normalHeroState,
        position: newPosition
    }
}

export let move = (worldState: worldState, normalHero: normalHero): worldState => {
    let normalHeroState = _getNormalHeroState(worldState, normalHero)

    let { position, velocity } = normalHeroState

    let [x, y, z] = position

    return _setNormalHeroState(worldState, normalHero,
        {
            ...normalHeroState,
            position: [x + velocity, y + velocity, z + velocity]
        }
    )
}