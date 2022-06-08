import { createEditScene, injectDependencies } from "./Editor";
import { implement } from "./ThreeImplement";

injectDependencies(implement())

createEditScene()