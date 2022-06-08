import { getDependency1, setDependency1 } from "./DependencyContainer";
import { IDependency1 } from "./IDependency1";

export let injectDependencies = function (dependency1Implement1: IDependency1, ...) {
	setDependency1(dependency1Implement1)
	注入其它依赖实现...
};

export let doSomethingNeedDependency1 = function () {
	let { abstractOperate1, ...} = getDependency1()

	let abstractType1 = abstractOperate1()

	...
}