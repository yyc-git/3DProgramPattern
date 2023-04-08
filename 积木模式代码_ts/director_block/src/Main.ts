import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getDependentBlockProtocolNameMap as getDependentBlockProtocolNameMapBlockManager, api, state as blockManagerState, blockProtocolName } from "block_manager/src/BlockManagerType"
import { service as directorService } from "director_block_protocol/src/service/ServiceType"
import { service as renderService } from "render_block_protocol/src/service/ServiceType"
import { state as renderState } from "render_block_protocol/src/state/StateType"
import { service as sceneManagerService } from "sceneManager_block_protocol/src/service/ServiceType"
import { dependentBlockProtocolNameMap } from "./DependentMapType"

//假实现
let requestAnimationFrame = (func) => {
}

let _loop = (api: api, blockManagerState: blockManagerState, sceneManagerBlockProtocolName: blockProtocolName, renderBlockProtocolName: blockProtocolName) => {
	//通过SceneManager Block Protocol接口来调用SceneManager Block的服务的update函数
	let sceneManagerService = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

	blockManagerState = sceneManagerService.update(blockManagerState)

	//通过Render Block Protocol接口来调用Render Block的服务的render函数
	let renderService = api.getBlockService<renderService>(blockManagerState, renderBlockProtocolName)

	blockManagerState = renderService.render(blockManagerState)

	requestAnimationFrame(
		(time) => {
			_loop(api, blockManagerState, sceneManagerBlockProtocolName, renderBlockProtocolName)
		}
	)
}

export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	directorService
> = (api, { sceneManagerBlockProtocolName, renderBlockProtocolName }) => {
	return {
		init: (blockManagerState) => {
			//通过SceneManager Block Protocol接口来调用SceneManager Block的服务的init函数
			let sceneManagerService = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

			blockManagerState = sceneManagerService.init(blockManagerState)

			//通过Render Block Protocol接口来调用Render Block的服务的init函数
			let renderService = api.getBlockService<renderService>(blockManagerState, renderBlockProtocolName)

			blockManagerState = renderService.init(blockManagerState)

			return blockManagerState
		},
		loop: (blockManagerState) => {
			_loop(api, blockManagerState, sceneManagerBlockProtocolName, renderBlockProtocolName)
		},
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
		"renderBlockProtocolName": "render_block_protocol"
	}
}