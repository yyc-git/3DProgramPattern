import { api, addNormalHero, addSuperHero, createState, init, loop } from "./World";
import { state as worldState } from "./WorldStateType";

let _createScene = (worldState: worldState): worldState => {
    let normalHero1Data = api.normalHero.create()
    let normalHero1 = normalHero1Data[1]

    worldState = addNormalHero(worldState, normalHero1Data)

    let normalHero2Data = api.normalHero.create()
    let normalHero2 = normalHero2Data[1]

    worldState = addNormalHero(worldState, normalHero2Data)


    worldState = api.normalHero.move(worldState, normalHero1)


    let superHero1Data = api.superHero.create()
    let superHero1 = superHero1Data[1]

    worldState = addSuperHero(worldState, superHero1Data)

    let superHero2Data = api.superHero.create()
    let superHero2 = superHero2Data[1]

    worldState = addSuperHero(worldState, superHero2Data)


    worldState = api.superHero.move(worldState, superHero1)
    worldState = api.superHero.fly(worldState, superHero1)


    return worldState
}

let worldState = createState()

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState)