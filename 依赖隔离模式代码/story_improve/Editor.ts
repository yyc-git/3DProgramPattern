import { getRenderEngine, setRenderEngine } from "./DependencyContainer";
import { RenderEngine } from "./RenderEngine";

export let injectDependencies = function (implement: RenderEngine) {
	setRenderEngine(implement);
};

export let createScene = function () {
	let { createScene, ...} = getRenderEngine()

	let scene = createScene()

	...
}