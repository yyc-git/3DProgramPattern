import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getDependentBlockProtocolNameMap as getDependentBlockProtocolNameMapBlockManager } from "block_manager/src/BlockManagerType"
import { service as sceneManagerService } from "sceneManager_block_protocol/src/service/ServiceType"
import { state as sceneManagerState } from "sceneManager_block_protocol/src/state/StateType"
import { service as mathService } from "math_block_protocol/src/service/ServiceType"
import { dependentBlockProtocolNameMap } from "./DependentMapType"

export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	sceneManagerService
> = (api, { mathBlockProtocolName }) => {
	return {
		createScene: (sceneManagerState) => {
			console.log("创建场景")

			let sceneGameObject = 1

			return {
				...sceneManagerState,
				allGameObjects: sceneManagerState.allGameObjects.concat([sceneGameObject])
			}
		},
		getAllGameObjects: (sceneManagerState) => {
			return sceneManagerState.allGameObjects
		},
		init: (blockManagerState) => {
			console.log("初始化场景")

			return blockManagerState
		},
		update: (blockManagerState) => {
			console.log("更新场景")

			//通过Math Block Protocol接口来调用Math Block的服务的multiplyMatrix函数
			let { multiplyMatrix } = api.getBlockService<mathService>(blockManagerState, mathBlockProtocolName)

			let _ = multiplyMatrix(1, 2)

			return blockManagerState
		}
	}
}

export let createBlockState: createBlockStateBlockManager<
	sceneManagerState
> = () => {
	return {
		allGameObjects: []
	}
}

export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
	return {
		"mathBlockProtocolName": "math_block_protocol"
	}
}