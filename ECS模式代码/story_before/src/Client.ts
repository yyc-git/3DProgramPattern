import * as WorldUtils from "ecs_pattern_utils/src/World";
import * as World from "./World";
import { state as worldState } from "./WorldStateType";

let _createScene = (worldState: worldState): worldState => {
    let normalHero1Data = World.api.normalHero.create()
    let normalHero1 = normalHero1Data[1]

    worldState = World.addNormalHero(worldState, normalHero1Data)

    let normalHero2Data = World.api.normalHero.create()
    let normalHero2 = normalHero2Data[1]

    worldState = World.addNormalHero(worldState, normalHero2Data)


    worldState = World.api.normalHero.move(worldState, normalHero1)


    let superHero1Data = World.api.superHero.create()
    let superHero1 = superHero1Data[1]

    worldState = World.addSuperHero(worldState, superHero1Data)

    let superHero2Data = World.api.superHero.create()
    let superHero2 = superHero2Data[1]

    worldState = World.addSuperHero(worldState, superHero2Data)


    worldState = World.api.superHero.move(worldState, superHero1)
    worldState = World.api.superHero.fly(worldState, superHero1)


    return worldState
}

let worldState = World.createState()

worldState = _createScene(worldState)

worldState = WorldUtils.init(worldState)

WorldUtils.loop(worldState, [World.update, World.renderOneByOne, World.renderInstances])