import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager } from "block_manager/src/BlockManagerType"
import { service as renderService } from "render_block_protocol/src/service/ServiceType"
import { state as renderState } from "render_block_protocol/src/state/StateType"
import { service as sceneManagerService } from "sceneManager_block_protocol/src/service/ServiceType"
import { state as sceneManagerState } from "sceneManager_block_protocol/src/state/StateType"
import { service as mathService } from "math_block_protocol/src/service/ServiceType"

export let getBlockService: getBlockServiceBlockManager<
	renderService
> = (api) => {
	return {
		init: (blockManagerState) => {
			console.log("初始化渲染")

			return blockManagerState
		},
		render: (blockManagerState) => {
			//依赖于SceneManager Block Protocol来调用SceneManager Block的服务的getAllGameObjects函数
			let { getAllGameObjects } = api.getBlockService<sceneManagerService>(blockManagerState, "sceneManager_block_protocol")

			let allGameObjects = getAllGameObjects(api.getBlockState<sceneManagerState>(blockManagerState, "sceneManager_block_protocol"))

			console.log("处理场景数据")

			//依赖于Math Block Protocol来调用Math Block的服务的multiplyMatrix函数
			let { multiplyMatrix } = api.getBlockService<mathService>(blockManagerState, "math_block_protocol")

			let _ = multiplyMatrix(1, 2)

			console.log("渲染")

			return blockManagerState
		}
	}
}

export let createBlockState: createBlockStateBlockManager<
	renderState
> = () => {
	return null
}