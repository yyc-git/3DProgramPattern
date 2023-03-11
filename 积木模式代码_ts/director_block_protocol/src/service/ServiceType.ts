import { state as blockManagerState } from "block_manager/src/BlockManagerType"

export type service = {
	init: (blockManagerState: blockManagerState) => blockManagerState,
	loop: (blockManagerState: blockManagerState) => void,
}