import { generateId } from "./IdUtils";
import { state as normalHeroState, hero as normalHero } from "./NormalHeroStateType";
import { state as worldState } from "./WorldStateType";
import { getNormalHeroState, setNormalHeroState } from "./WorldUtils";

// create函数负责创建一个普通英雄，该英雄的数据保存在一个normalHeroState中，并生成一个全局唯一的索引id与其关联
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

//这里只是给出了伪代码用于演示而已，实际的update函数应该会根据该普通英雄的层级关系和本地坐标来更新他的模型矩阵
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