import { api, addNormalHero, addSuperHero, createState, init, loop } from "./World";
import { state as worldState } from "./WorldStateType";

let _createScene = (worldState: worldState): worldState => {
    let normalHeroData1 = api.normalHero.create()
    let normalHero1 = normalHeroData1[1]

    worldState = addNormalHero(worldState, normalHeroData1)

    let normalHeroData2 = api.normalHero.create()
    let normalHero2 = normalHeroData2[1]

    worldState = addNormalHero(worldState, normalHeroData2)


    worldState = api.normalHero.move(worldState, normalHero1)


    let superHeroData1 = api.superHero.create()
    let superHero1 = superHeroData1[1]

    worldState = addSuperHero(worldState, superHeroData1)

    let superHeroData2 = api.superHero.create()
    let superHero2 = superHeroData2[1]

    worldState = addSuperHero(worldState, superHeroData2)


    worldState = api.superHero.move(worldState, superHero1)
    worldState = api.superHero.fly(worldState, superHero1)


    return worldState
}

let worldState = createState()

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState)