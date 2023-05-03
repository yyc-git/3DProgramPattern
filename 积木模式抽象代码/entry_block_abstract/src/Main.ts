import * as BlockManagerType from "block_manager_abstract/src/BlockManagerType"
import * as EntryBlockProtocolServiceType from "entry_block_protocol_abstract/src/service/ServiceType"
import * as EntryBlockProtocolStateType from "entry_block_protocol_abstract/src/state/StateType"
import * as DependentMapType from "./DependentMapType"

export let getBlockService: BlockManagerType.getBlockService<
	DependentMapType.dependentBlockProtocolNameMap,
	EntryBlockProtocolServiceType.service
> = (api, { block1ProtocolName, block2ProtocolName, ... }) => {
	return {
		实现service...
	}
}

export let createBlockState: BlockManagerType.createBlockState<
	EntryBlockProtocolStateType.state
> = () => {
	return 创建blockState...
}

export let getDependentBlockProtocolNameMap: BlockManagerType.getDependentBlockProtocolNameMap = () => {
	return {
		"block1ProtocolName": "block1 protocol's package.json's name",
		"block2ProtocolName": "block2 protocol's package.json's name",
		...
	}
}