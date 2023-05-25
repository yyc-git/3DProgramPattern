

import * as Main$Math_block_res from "../../../../../node_modules/math_block_res/lib/es6_global/src/Main.bs.js";
import * as Main$Engine_block_res from "../../../../../node_modules/engine_block_res/lib/es6_global/src/Main.bs.js";
import * as Main$Render_block_res from "../../../../../node_modules/render_block_res/lib/es6_global/src/Main.bs.js";
import * as Main$Block_manager_res from "../../../../../node_modules/block_manager_res/lib/es6_global/src/Main.bs.js";
import * as Main$Director_block_res from "../../../../../node_modules/director_block_res/lib/es6_global/src/Main.bs.js";
import * as Main$SceneManager_block_res from "../../../../../node_modules/sceneManager_block_res/lib/es6_global/src/Main.bs.js";

function init(param) {
  return Main$Block_manager_res.registerBlock(Main$Block_manager_res.registerBlock(Main$Block_manager_res.registerBlock(Main$Block_manager_res.registerBlock(Main$Block_manager_res.registerBlock(Main$Block_manager_res.createState(undefined), "engine_block_protocol_res", Main$Engine_block_res.getBlockService, Main$Engine_block_res.createBlockState(undefined)), "director_block_protocol_res", Main$Director_block_res.getBlockService, Main$Director_block_res.createBlockState(undefined)), "sceneManager_block_protocol_res", Main$SceneManager_block_res.getBlockService, Main$SceneManager_block_res.createBlockState(undefined)), "render_block_protocol_res", Main$Render_block_res.getBlockService, Main$Render_block_res.createBlockState(undefined)), "math_block_protocol_res", Main$Math_block_res.getBlockService, Main$Math_block_res.createBlockState(undefined));
}

function getEntryBlockProtocolName(param) {
  return "engine_block_protocol_res";
}

var getBlockService = Main$Block_manager_res.getBlockServiceExn;

export {
  init ,
  getEntryBlockProtocolName ,
  getBlockService ,
}
/* No side effect */
