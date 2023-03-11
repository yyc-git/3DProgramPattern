'use strict';

var Curry = require("rescript/lib/js/curry.js");
var Main$Block_facade_res = require("block_facade_res/lib/js/src/Main.bs.js");

var blockManagerState = Main$Block_facade_res.init(undefined);

var match = Main$Block_facade_res.getBlockService(blockManagerState, Main$Block_facade_res.getEntryBlockProtocolName(undefined));

var scene = match.scene;

var director = match.director;

var blockManagerState$1 = Curry._1(scene.createScene, blockManagerState);

var blockManagerState$2 = Curry._1(director.init, blockManagerState$1);

Curry._1(director.loop, blockManagerState$2);

exports.director = director;
exports.scene = scene;
exports.blockManagerState = blockManagerState$2;
/* blockManagerState Not a pure module */
