import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager } from "block_manager/src/BlockManagerType"
import { service as engineService } from "engine_block_protocol/src/service/ServiceType"
import { state as state } from "engine_block_protocol/src/state/StateType"
import { service as directorService } from "director_block_protocol/src/service/ServiceType"
import { service as sceneManagerService } from "sceneManager_block_protocol/src/service/ServiceType"
import { state as sceneManagerState } from "sceneManager_block_protocol/src/state/StateType"

export let getBlockService: getBlockServiceBlockManager<
	engineService
> = (api) => {
	return {
		director: {
			init: (blockManagerState) => {
				//依赖于Director Block Protocol来调用Director Block的服务的init函数
				let { init } = api.getBlockService<directorService>(blockManagerState, "director_block_protocol")

				return init(blockManagerState)
			},
			loop: (blockManagerState) => {
				//依赖于Director Block Protocol来调用Director Block的服务的loop函数
				let { loop } = api.getBlockService<directorService>(blockManagerState, "director_block_protocol")

				return loop(blockManagerState)
			}
		},
		scene: {
			createScene: (blockManagerState) => {
				//依赖于SceneManager Block Protocol来调用SceneManager Block的服务的createScene函数
				let { createScene } = api.getBlockService<sceneManagerService>(blockManagerState, "sceneManager_block_protocol")

				//因为createScene函数返回了新的SceneManager Block的state，所以调用BlockManager的api的setBlockState将其保存到BlockManagerState中，并返回新的BlockManagerState
				return api.setBlockState<sceneManagerState>(
					blockManagerState,
					"sceneManager_block_protocol",
					createScene(api.getBlockState<sceneManagerState>(blockManagerState, "sceneManager_block_protocol"))
				)
			}
		}
	}
}

export let createBlockState: createBlockStateBlockManager<
	state
> = () => {
	return null
}