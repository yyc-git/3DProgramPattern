import { createState, registerAllPipelines, runPipeline1, runPipelineX... } from "system_abstract/src/System"

let systemState = createState()

systemState = registerAllPipelines(systemState)

runPipeline1(systemState).then(newSystemState => {
    systemState = newSystemState

    runPipelineX...
})