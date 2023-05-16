type scene = any;

interface IRenderEngine {
    scene:{
        createScene:void => scene
    },
    ...
}

export let getRenderEngine = (): IRenderEngine => {
    return window.renderEngine;
}

export let setRenderEngine = (renderEngine: IRenderEngine) {
    window.renderEngine = renderEngine;
}

export let getScene = () => {
    return window.scene;
}

export let setScene = (scene) => {
    window.scene = scene;
}

let _createBox = () => {
    let { scene, mesh, basicMaterial, boxGeometry } = getRenderEngine();

    let scene = scene.createScene();

    let geometry = boxGeometry.createGeometry();
    let material = basicMaterial.createMaterial();

    let cube = mesh.createMesh();
    mesh.setMaterial(cube, material);
    mesh.setGeometry(cube, geometry);

    scene.addMesh(scene, cube);

    return scene;
}

export let createScene1 = () => {
    _createBox();
}

export let createScene2 = () => {
    let { scene, mesh, basicMaterial, sphereGeometry } = getRenderEngine();

    let scene = _createBox();

    let geometry = sphereGeometry.createGeometry();
    let material = basicMaterial.createMaterial();

    let sphere = mesh.createMesh();
    mesh.setMaterial(sphere, material);
    mesh.setGeometry(sphere, geometry);

    scene.addMesh(scene, sphere);

    return scene;
}

export let sendSceneData = (scene:scene) => {
    return fetch(serverUrl, scene);
}

export let log = (message) => {
    console.log(message);
}