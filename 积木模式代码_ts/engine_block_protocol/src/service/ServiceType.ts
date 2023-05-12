import { state as blockManagerState } from "block_manager/src/BlockManagerType"

type directorAPI = {
	init: (blockManagerState: blockManagerState) => blockManagerState,
	loop: (blockManagerState: blockManagerState) => void,
}

type sceneAPI = {
	createScene: (blockManagerState: blockManagerState) => blockManagerState,
}

export type service = {
	director: directorAPI
	scene: sceneAPI
}