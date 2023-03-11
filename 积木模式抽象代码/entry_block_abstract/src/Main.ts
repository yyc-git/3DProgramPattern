import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getDependentBlockProtocolNameMap as getDependentBlockProtocolNameMapBlockManager } from "block_manager_abstract/src/BlockManagerType"
import { service } from "entry_block_protocol_abstract/src/service/ServiceType"
import { state } from "entry_block_protocol_abstract/src/state/StateType"
import { dependentBlockProtocolNameMap } from "./DependentMapType"

export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	service
> = (api, { block1ProtocolName, block2ProtocolName, ... }) => {
	return {
		实现service...
	}
}

export let createBlockState: createBlockStateBlockManager<
	state
> = () => {
	return 创建state...
}

export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
	return {
		"block1ProtocolName": "block1 protocol's package.json's name",
		"block2ProtocolName": "block2 protocol's package.json's name",
		...
	}
}