import { generateId } from "./IdUtils";
import { state as superHeroState, hero as superHero } from "./SuperHeroStateType";
import { state as worldState } from "./WorldStateType";

let _getSuperHeroState = (worldState: worldState, superHero: superHero): superHeroState => {
    return worldState.superHeros.get(superHero)
}


let _setSuperHeroState = (worldState: worldState, superHero: superHero, superHeroState: superHeroState) => {
    return {
        ...worldState,
        superHeros: worldState.superHeros.set(superHero, superHeroState)
    }
}

export let create = (worldState: worldState): [worldState, superHero] => {
    let superHeroState: superHeroState = {
        position: [0, 0, 0],
        velocity: 1.0,
        maxFlyVelocity: 2.0
    }

    let id = generateId()

    return [
        _setSuperHeroState(worldState, id, superHeroState),
        id
    ]
}

export let update = (superHeroState: superHeroState): superHeroState => {
    console.log("更新SuperHero")

    let [x, y, z] = superHeroState.position

    //更新position（如更新世界坐标系中的position）...
    let newPosition: [number, number, number] = [x * 2.0, y * 2.0, z * 2.0]

    return {
        ...superHeroState,
        position: newPosition
    }
}

export let move = (worldState: worldState, superHero: superHero): worldState => {
    let superHeroState = _getSuperHeroState(worldState, superHero)

    let { position, velocity } = superHeroState

    let [x, y, z] = position

    return _setSuperHeroState(worldState, superHero,
        {
            ...superHeroState,
            position: [x + velocity, y + velocity, z + velocity]
        }
    )
}

export let fly = (worldState: worldState, superHero: superHero): worldState => {
    let superHeroState = _getSuperHeroState(worldState, superHero)

    let { position, velocity, maxFlyVelocity } = superHeroState

    let [x, y, z] = position

    velocity = velocity < maxFlyVelocity ? velocity : maxFlyVelocity

    return _setSuperHeroState(worldState, superHero,
        {
            ...superHeroState,
            position: [x + velocity, y + velocity, z + velocity]
        }
    )
}