import * as NormalHero from "./NormalHero";
import * as SuperHero from "./SuperHero";
import { createState, init, loop } from "./World";
import { state as worldState } from "./WorldStateType";

let _createScene = (worldState: worldState): worldState => {
    let data1 = NormalHero.create(worldState)
    worldState = data1[0]
    let normalHero1 = data1[1]
    data1 = NormalHero.create(worldState)
    worldState = data1[0]
    let normalHero2 = data1[1]

    worldState = NormalHero.move(worldState, normalHero1)


    let data2 = SuperHero.create(worldState)
    worldState = data2[0]
    let superHero1 = data2[1]
    data2 = SuperHero.create(worldState)
    worldState = data2[0]
    let superHero2 = data2[1]

    worldState = SuperHero.move(worldState, superHero1)
    worldState = SuperHero.fly(worldState, superHero1)


    return worldState
}

let worldState = createState()

worldState = _createScene(worldState)

worldState = init(worldState)

loop(worldState)