import { createState, registerAllPipelines, runPipeline1... } from "system_abstract/src/System"

let systemState = createState()

systemState = registerAllPipelines(systemState)

init(systemState, configForInit).then(systemState => {
    runPipeline1(systemState, configForPipeline1).then(systemState => {
        运行其它的管道...
    })
})
