import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getDependentBlockProtocolNameMap as getDependentBlockProtocolNameMapBlockManager } from "block_manager/src/BlockManagerType"
import { service as engineService } from "engine_block_protocol/src/service/ServiceType"
import { state as engineState } from "engine_block_protocol/src/state/StateType"
import { service as directorService } from "director_block_protocol/src/service/ServiceType"
import { service as sceneManagerService } from "sceneManager_block_protocol/src/service/ServiceType"
import { state as sceneManagerState } from "sceneManager_block_protocol/src/state/StateType"
import { dependentBlockProtocolNameMap } from "./DependentMapType"

//实现积木协议定义的服务
export let getBlockService: getBlockServiceBlockManager<
    //该类型定义在Engine Block->DependentBlockProtocolNameMap
	dependentBlockProtocolNameMap,
    //该类型是Engine Block Protocol->ServiceType->service
	engineService
> = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
    //返回服务
	return {
		director: {
			init: (blockManagerState) => {
				//通过Director Block Protocol来调用Director Block的服务的init函数
				let { init } = api.getBlockService<directorService>(blockManagerState, directorBlockProtocolName)

				return init(blockManagerState)
			},
			loop: (blockManagerState) => {
				//通过Director Block Protocol来调用Director Block的服务的loop函数
				let { loop } = api.getBlockService<directorService>(blockManagerState, directorBlockProtocolName)

				return loop(blockManagerState)
			}
		},
		scene: {
			createScene: (blockManagerState) => {
				//通过SceneManager Block Protocol来调用SceneManager Block的服务的createScene函数
				let { createScene } = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

				//因为createScene函数返回了新的SceneManager Block的state，所以调用BlockManager的api的setBlockState将其保存到BlockManagerState中，并返回新的BlockManagerState
				return api.setBlockState<sceneManagerState>(
					blockManagerState,
					sceneManagerBlockProtocolName,
					createScene(api.getBlockState<sceneManagerState>(blockManagerState, sceneManagerBlockProtocolName))
				)
			}
		}
	}
}

//实现积木协议定义的state
export let createBlockState: createBlockStateBlockManager<
    //该类型是Engine Block Protocol->StateType->state
	engineState
> = () => {
    //返回state，该state为空
	return null
}

//获得依赖的所有积木协议名
export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
	return {
		"directorBlockProtocolName": "director_block_protocol",
		"sceneManagerBlockProtocolName": "sceneManager_block_protocol"
	}
}