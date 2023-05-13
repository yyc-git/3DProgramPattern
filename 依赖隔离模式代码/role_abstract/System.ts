import * as DependencyContainer from "./DependencyContainer";
import { Dependency1, abstractType1 } from "./Dependency1";

export let injectDependencies = function (dependency1Implement1: Dependency1, ...) {
	DependencyContainer.setDependency1(dependency1Implement1)
	注入其它DependencyImplement...
};

export let doSomethingUseDependency1 = function () {
	let { abstractOperate1, ...}: Dependency1 = DependencyContainer.getDependency1()

	let value1: abstractType1 = abstractOperate1()

	...
}

更多doSomethingUseDependencyX函数...