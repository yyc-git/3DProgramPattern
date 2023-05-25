let getBlockService: Block_manager_res.BlockManagerType.getBlockService<
  Math_block_protocol_res.ServiceType.service,
> = api => {
  multiplyMatrix: (mat1, mat2) => {
    Js.log("计算")

    Obj.magic(1)
  },
}

let createBlockState: Block_manager_res.BlockManagerType.createBlockState<
  Math_block_protocol_res.StateType.state,
> = () => {
  Js.Nullable.null->Obj.magic
}
