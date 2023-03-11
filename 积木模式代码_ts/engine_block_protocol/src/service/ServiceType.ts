import { state as blockManagerState } from "block_manager/src/BlockManagerType"
import { state as sceneManagerState } from "sceneManager_block_protocol/src/state/StateType"

type directorAPI = {
	init: (blockManagerState: blockManagerState) => blockManagerState,
	loop: (blockManagerState: blockManagerState) => void,
}

type sceneAPI = {
	// createScene: (sceneManagerState) => sceneManagerState,
	createScene: (blockManagerState) => blockManagerState,
}

export type service = {
	director: directorAPI
	scene: sceneAPI
}