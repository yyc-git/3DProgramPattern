import * as NormalHero from "./NormalHero";
import * as SuperHero from "./SuperHero";
import { addNormalHero, addSuperHero, createState, init, loop } from "./World";
import { state as worldState } from "./WorldStateType";

let _createScene = (worldState: worldState): worldState => {
    let normalHeroData1 = NormalHero.create()
    let normalHero1 = normalHeroData1[1]

    worldState = addNormalHero(worldState, normalHeroData1)

    let normalHeroData2 = NormalHero.create()
    let normalHero2 = normalHeroData2[1]

    worldState = addNormalHero(worldState, normalHeroData2)


    worldState = NormalHero.move(worldState, normalHero1)


    let superHeroData1 = SuperHero.create()
    let superHero1 = superHeroData1[1]

    worldState = addSuperHero(worldState, superHeroData1)

    let superHeroData2 = SuperHero.create()
    let superHero2 = superHeroData2[1]

    worldState = addSuperHero(worldState, superHeroData2)


    worldState = SuperHero.move(worldState, superHero1)
    worldState = SuperHero.fly(worldState, superHero1)


    return worldState
}

let worldState = createState()

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState)