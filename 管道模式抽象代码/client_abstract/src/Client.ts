import { createState, registerAllPipelines, runPipeline1, runPipelineX... } from "system_abstract/src/System"

let systemState = createState()

systemState = registerAllPipelines(systemState)

init(systemState, configForInit).then(newSystemState => {
    systemState = newSystemState

    runPipeline1(systemState, configForPipeline1).then(newSystemState => {
        systemState = newSystemState

        runPipelineX...
    })
})
