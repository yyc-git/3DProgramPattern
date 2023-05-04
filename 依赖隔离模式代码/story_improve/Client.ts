import * as Editor from "./Editor";
import * as BabylonImplement from "./BabylonImplement";

Editor.injectDependencies(BabylonImplement.implement())

Editor.createScene()