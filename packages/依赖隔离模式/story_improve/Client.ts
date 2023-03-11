import { createScene, injectDependencies } from "./Editor";
import { implement } from "./ThreeImplement";

injectDependencies(implement())

createScene()