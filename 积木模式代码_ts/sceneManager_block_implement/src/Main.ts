import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager } from "block_manager/src/BlockManagerType"
import { service as sceneManagerService } from "sceneManager_block_protocol/src/service/ServiceType"
import { state as sceneManagerState } from "sceneManager_block_protocol/src/state/StateType"
import { service as mathService } from "math_block_protocol/src/service/ServiceType"

export let getBlockService: getBlockServiceBlockManager<
	sceneManagerService
> = (api) => {
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

			//依赖于Math Block Protocol来调用Math Block的服务的multiplyMatrix函数
			let { multiplyMatrix } = api.getBlockService<mathService>(blockManagerState, "math_block_protocol")

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