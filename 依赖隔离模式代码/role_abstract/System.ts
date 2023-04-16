import { getDependency1, setDependency1 } from "./DependencyContainer";
import { Dependency1 } from "./Dependency1";

export let injectDependencies = function (dependency1Implement1: Dependency1, ...) {
	setDependency1(dependency1Implement1)
	注入其它DependencyImplement...
};

export let doSomethingUseDependency1 = function () {
	let { abstractOperate1, ...} = getDependency1()

	let abstractType1 = abstractOperate1()

	...
}