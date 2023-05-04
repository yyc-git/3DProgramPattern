import * as DependencyContainer from "./DependencyContainer";
import { Engine } from "./Engine";

export let injectDependencies = function (implement: Engine) {
	DependencyContainer.setEngine(implement);
};

export let createScene = function () {
	let { createScene, ...}: Engine = DependencyContainer.getEngine()

	let scene = createScene()

	...
}