import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getDependentBlockProtocolNameMap as getDependentBlockProtocolNameMapBlockManager } from "block_manager/src/BlockManagerType"
import { service as renderService } from "render_block_protocol/src/service/ServiceType"
import { state as renderState } from "render_block_protocol/src/state/StateType"
import { service as sceneManagerService } from "sceneManager_block_protocol/src/service/ServiceType"
import { state as sceneManagerState } from "sceneManager_block_protocol/src/state/StateType"
import { service as mathService } from "math_block_protocol/src/service/ServiceType"
import { dependentBlockProtocolNameMap } from "./DependentMapType"

export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	renderService
> = (api, { sceneManagerBlockProtocolName, mathBlockProtocolName }) => {
	return {
		init: (blockManagerState) => {
			console.log("初始化渲染")

			return blockManagerState
		},
		render: (blockManagerState) => {
			//通过SceneManager Block Protocol来调用SceneManager Block的服务的getAllGameObjects函数
			let { getAllGameObjects } = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

			let allGameObjects = getAllGameObjects(api.getBlockState<sceneManagerState>(blockManagerState, sceneManagerBlockProtocolName))

			console.log("处理场景数据")

			//通过Math Block Protocol来调用Math Block的服务的multiplyMatrix函数
			let { multiplyMatrix } = api.getBlockService<mathService>(blockManagerState, mathBlockProtocolName)

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

export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
	return {
		"sceneManagerBlockProtocolName": "sceneManager_block_protocol",
		"mathBlockProtocolName": "math_block_protocol"
	}
}