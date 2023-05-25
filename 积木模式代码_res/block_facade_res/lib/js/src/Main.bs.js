'use strict';

var Main$Math_block_res = require("math_block_res/lib/js/src/Main.bs.js");
var Main$Engine_block_res = require("engine_block_res/lib/js/src/Main.bs.js");
var Main$Render_block_res = require("render_block_res/lib/js/src/Main.bs.js");
var Main$Block_manager_res = require("block_manager_res/lib/js/src/Main.bs.js");
var Main$Director_block_res = require("director_block_res/lib/js/src/Main.bs.js");
var Main$SceneManager_block_res = require("sceneManager_block_res/lib/js/src/Main.bs.js");

function init(param) {
  return Main$Block_manager_res.registerBlock(Main$Block_manager_res.registerBlock(Main$Block_manager_res.registerBlock(Main$Block_manager_res.registerBlock(Main$Block_manager_res.registerBlock(Main$Block_manager_res.createState(undefined), "engine_block_protocol_res", Main$Engine_block_res.getBlockService, Main$Engine_block_res.createBlockState(undefined)), "director_block_protocol_res", Main$Director_block_res.getBlockService, Main$Director_block_res.createBlockState(undefined)), "sceneManager_block_protocol_res", Main$SceneManager_block_res.getBlockService, Main$SceneManager_block_res.createBlockState(undefined)), "render_block_protocol_res", Main$Render_block_res.getBlockService, Main$Render_block_res.createBlockState(undefined)), "math_block_protocol_res", Main$Math_block_res.getBlockService, Main$Math_block_res.createBlockState(undefined));
}

function getEntryBlockProtocolName(param) {
  return "engine_block_protocol_res";
}

var getBlockService = Main$Block_manager_res.getBlockServiceExn;

exports.init = init;
exports.getEntryBlockProtocolName = getEntryBlockProtocolName;
exports.getBlockService = getBlockService;
/* No side effect */
