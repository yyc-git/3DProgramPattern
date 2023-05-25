import * as BlockManagerType from "block_manager_abstract/src/BlockManagerType"
import * as BlockProtocolServiceType from "block_protocol_abstract/src/service/ServiceType"
import * as BlockProtocolStateType from "block_protocol_abstract/src/state/StateType"

export let getBlockService: BlockManagerType.getBlockService<
	BlockProtocolServiceType.service
> = (api) => {
	return {
		实现service...
	}
}

export let createBlockState: BlockManagerType.createBlockState<
	BlockProtocolStateType.state
> = () => {
	return 创建blockState...
}