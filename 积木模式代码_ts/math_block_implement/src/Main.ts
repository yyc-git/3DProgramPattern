import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getDependentBlockProtocolNameMap as getDependentBlockProtocolNameMapBlockManager } from "block_manager/src/BlockManagerType"
import { service as mathService } from "math_block_protocol/src/service/ServiceType"
import { state as mathState } from "math_block_protocol/src/state/StateType"
import { dependentBlockProtocolNameMap } from "./DependentMapType"

export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	mathService
> = (api, _) => {
	return {
		multiplyMatrix: (mat1, mat2) => {
			console.log("计算")

			return 1
		}
	}
}

export let createBlockState: createBlockStateBlockManager<
	mathState
> = () => {
	return null
}

export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
	//没有依赖的积木
	return {
	}
}