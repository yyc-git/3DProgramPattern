import { doSomethingNeedDependency1, injectDependencies } from "./App";
import { implement } from "./Dependency1Implement1";

injectDependencies(implement(), 其它依赖实现...)

doSomethingNeedDependency1()