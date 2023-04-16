import { doSomethingUseDependency1, injectDependencies } from "./System";
import { implement } from "./Dependency1Implement1";

injectDependencies(implement(), 其它DependencyImplement...)

doSomethingUseDependency1()