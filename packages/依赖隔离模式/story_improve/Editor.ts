import { getRenderEngine, setRenderEngine } from "./DependencyContainer";
import { IRenderEngine } from "./IRenderEngine";

export let injectDependencies = function (threeImplement: IRenderEngine) {
	setRenderEngine(threeImplement);
};

export let createScene = function () {
	let { createScene, ...} = getRenderEngine()

	let scene = createScene()

	...
}