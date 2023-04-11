import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/main/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { getAllGameObjects } from "multithread_pattern_ecs/src/manager/gameObject/Manager"
import { getComponentExn as getMaterialExn } from "multithread_pattern_ecs/src/manager/basicMaterial_component/Manager"
import { getComponentExn as getTransformExn } from "multithread_pattern_ecs/src/manager/transform_component/Manager"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let state = getState(states)

	return mostService.callFunc(() => {
		console.log("update render data buffer job exec on main worker");

		let allGameObjects = getAllGameObjects(getExnFromStrictNull(worldState.ecsData.gameObjectManagerState));
		let renderDataBufferTypeArray = getExnFromStrictNull(state.renderDataBufferTypeArray)
		let renderGameObjectsCount = 0;
		let typeArrayIndex: number = 0;

		allGameObjects.forEach((gameObject) => {
			let material = getMaterialExn(getExnFromStrictNull(worldState.ecsData.basicMaterialComponentManagerState), gameObject)
			let transform = getTransformExn(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState), gameObject)

			renderDataBufferTypeArray[typeArrayIndex * 2] = transform
			renderDataBufferTypeArray[typeArrayIndex * 2 + 1] = material

			renderGameObjectsCount++;
			typeArrayIndex++;
		})

		return setStatesFunc<worldState, states>(
			worldState,
			setState(states, {
				...state,
				renderDataBufferTypeArray,
				renderGameObjectsCount
			})
		)
	})
}