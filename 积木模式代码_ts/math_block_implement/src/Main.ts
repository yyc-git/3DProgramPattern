import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager } from "block_manager/src/BlockManagerType"
import { service as mathService } from "math_block_protocol/src/service/ServiceType"
import { state as mathState } from "math_block_protocol/src/state/StateType"

export let getBlockService: getBlockServiceBlockManager<
	mathService
> = (api) => {
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