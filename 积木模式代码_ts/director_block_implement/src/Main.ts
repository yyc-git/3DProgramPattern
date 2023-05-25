import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, api, state as blockManagerState, blockProtocolName } from "block_manager/src/BlockManagerType"
import { service as directorService } from "director_block_protocol/src/service/ServiceType"
import { service as renderService } from "render_block_protocol/src/service/ServiceType"
import { state as renderState } from "render_block_protocol/src/state/StateType"
import { service as sceneManagerService } from "sceneManager_block_protocol/src/service/ServiceType"

//假实现
let requestAnimationFrame = (func) => {
}

let _loop = (api: api, blockManagerState: blockManagerState, sceneManagerBlockProtocolName: blockProtocolName, renderBlockProtocolName: blockProtocolName) => {
	//依赖于SceneManager Block Protocol来调用SceneManager Block的服务的update函数
	let sceneManagerService = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

	blockManagerState = sceneManagerService.update(blockManagerState)

	//依赖于Render Block Protocol来调用Render Block的服务的render函数
	let renderService = api.getBlockService<renderService>(blockManagerState, renderBlockProtocolName)

	blockManagerState = renderService.render(blockManagerState)

	requestAnimationFrame(
		(time) => {
			_loop(api, blockManagerState, sceneManagerBlockProtocolName, renderBlockProtocolName)
		}
	)
}

export let getBlockService: getBlockServiceBlockManager<
	directorService
> = (api) => {
	return {
		init: (blockManagerState) => {
			//依赖于SceneManager Block Protocol来调用SceneManager Block的服务的init函数
			let sceneManagerService = api.getBlockService<sceneManagerService>(blockManagerState, "sceneManager_block_protocol")

			blockManagerState = sceneManagerService.init(blockManagerState)

			//依赖于Render Block Protocol来调用Render Block的服务的init函数
			let renderService = api.getBlockService<renderService>(blockManagerState, "render_block_protocol")

			blockManagerState = renderService.init(blockManagerState)

			return blockManagerState
		},
		loop: (blockManagerState) => {
			_loop(api, blockManagerState, "sceneManager_block_protocol", "render_block_protocol")
		},
	}
}

export let createBlockState: createBlockStateBlockManager<
	renderState
> = () => {
	return null
}
