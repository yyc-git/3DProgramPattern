<template>
  <section>
    <h1>Global Data1 is {{ globalData1 }}</h1>
    <button @click="createScene1()">创建场景1</button>
    <button @click="createScene2()">创建场景2</button>
    <button @click="sendScene2Data()">发送场景2数据</button>


<%={
UIManager.parse().forEach(render)
}=%>
    <!-- <button @click="">ss</button> -->
  </section>
</template>

<script>
import Vue from "vue";
import {
  Scene,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  SphereGeometry,
} from "three";
import {
  setRenderEngine,
  createScene1,
  createScene2,
  sendSceneData,
  log,
} from "./BusLayerCode";

let _injectDependencies = () => {
  setRenderEngine({
    scene: {
      createScene: () => {
        return new Scene();
      },
      addMesh: (scene, mesh) => {
        scene.add(mesh);
      },
    },
    mesh: {
      createMesh: () => {
        return new Mesh();
      },
      setMaterial: (mesh, material) => {
        mesh.material = material;
      },
      setGeometry: (mesh, geometry) => {
        mesh.geometry = geometry;
      },
    },
    basicMaterial: {
      createMaterial: () => new MeshBasicMaterial(),
    },
    boxGeometry: {
      createGeometry: () => new BoxGeometry(),
    },
    sphereGeometry: {
      createGeometry: () => new SphereGeometry(),
    },
  });
};

export default Vue.extend({
  name: "Component",
  mounted: function () {
    _injectDependencies();
  },
  methods: {
    createScene1: function () {
      createScene1();
    },
    createScene2: function () {
      setScene(createScene2());
    },
    sendScene2Data: function () {
      sendSceneData(getScene()).then(log);
    },
  },
  computed: {
    globalData1() {
      return this.$store.state.component.globalData1;
    },
  },
});
</script>

<style>
</style>
