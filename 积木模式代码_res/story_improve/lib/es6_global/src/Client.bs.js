

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Main$Block_facade_res from "../../../../../node_modules/block_facade_res/lib/es6_global/src/Main.bs.js";

var blockManagerState = Main$Block_facade_res.init(undefined);

var match = Main$Block_facade_res.getBlockService(blockManagerState, Main$Block_facade_res.getEntryBlockProtocolName(undefined));

var scene = match.scene;

var director = match.director;

var blockManagerState$1 = Curry._1(scene.createScene, blockManagerState);

var blockManagerState$2 = Curry._1(director.init, blockManagerState$1);

Curry._1(director.loop, blockManagerState$2);

export {
  director ,
  scene ,
  blockManagerState$2 as blockManagerState,
}
/* blockManagerState Not a pure module */
