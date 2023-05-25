import * as BlockManagerType from "block_manager_abstract/src/BlockManagerType"
import * as EntryBlockProtocolServiceType from "entry_block_protocol_abstract/src/service/ServiceType"
import * as EntryBlockProtocolStateType from "entry_block_protocol_abstract/src/state/StateType"

export let getBlockService: BlockManagerType.getBlockService<
	EntryBlockProtocolServiceType.service
> = (api) => {
	return {
		实现service...
	}
}

export let createBlockState: BlockManagerType.createBlockState<
	EntryBlockProtocolStateType.state
> = () => {
	return 创建blockState...
}