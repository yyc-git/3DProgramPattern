import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { getPosition } from "../../../multithread_pattern_ecs/src/manager/transform_component/Manager"

let _generateRandom = () => {
    return Math.random() * 2 - 1
}

export let computeAveragePositions = (worldState: worldState, allTransforms: Array<number>): Array<[number, Array<number>]> => {
    let transformComponentManagerState = getExnFromStrictNull(worldState.ecsData.transformComponentManagerState)

    let wholeAveragePosition = allTransforms.reduce((averagePosition, transform) => {
        let [x, y, z] = getPosition(transformComponentManagerState, transform)

        return [(averagePosition[0] + x) / 2.0, (averagePosition[1] + y) / 2.0, (averagePosition[2] + z) / 2.0,]
    }, [0.0, 0.0, 0.0])

    return allTransforms.map((transform) => {
        let oldPosition = getPosition(transformComponentManagerState, transform)
        let [x, y, z] = oldPosition

        wholeAveragePosition = [wholeAveragePosition[0] * _generateRandom() + _generateRandom(), wholeAveragePosition[1] * _generateRandom() + _generateRandom(), wholeAveragePosition[2] * _generateRandom() + _generateRandom()]

        let newPosition = [(wholeAveragePosition[0] + x) / 2.0, (wholeAveragePosition[1] + y) / 2.0, (wholeAveragePosition[2] + z) / 2.0,]

        if (Math.abs(newPosition[0]) < 1.0 && Math.abs(newPosition[1]) < 1.0 && Math.abs(newPosition[2]) < 1.0) {
            return [transform, newPosition]
        }

        return [transform, oldPosition]
    })
}