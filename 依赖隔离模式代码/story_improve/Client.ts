import { createScene, injectDependencies } from "./Editor";
import { implement } from "./BabylonImplement";

injectDependencies(implement())

createScene()