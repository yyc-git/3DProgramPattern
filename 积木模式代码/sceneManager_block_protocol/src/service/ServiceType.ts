import { state as sceneManagerState, allGameObjects } from "../state/StateType"
import { state as blockManagerState } from "block_manager/src/BlockManagerType"

export type service = {
	createScene: (sceneManagerState) => sceneManagerState,
	getAllGameObjects: (sceneManagerState) => allGameObjects,
	init: (blockManagerState: blockManagerState) => blockManagerState,
	update: (blockManagerState: blockManagerState) => blockManagerState,
}