import * as System  from "system_abstract/src/System"

let systemState = System.createState()

systemState = System.registerAllPipelines(systemState)

System.init(systemState, configForInit).then(systemState => {
    System.runPipeline1(systemState, configForPipeline1).then(systemState => {
        运行其它的管道...
    })
})
