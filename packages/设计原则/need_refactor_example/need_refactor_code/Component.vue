<template>
  <section>
    <!-- 不要用全局变量 -->
    <h1>Global Data1 is {{ window.globalData1 }}</h1>
    <button @click="createScene1()">创建场景1</button>
    <!-- 一个函数做两件事情 -->
    <button @click="createScene2AndSendSceneData()">
      创建场景2并且发送场景数据
    </button>
  </section>
</template>

<script>
import Vue from "vue";
// 如何替换three.js为wonder而不影响ui代码？
import {
  Scene,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  SphereGeometry,
} from "three";

export default Vue.extend({
  name: "Component",
  methods: {
    createScene1: function () {
      let scene = new Scene();

      let geometry = new BoxGeometry();
      let material = new MeshBasicMaterial();

      let cube = new Mesh();
      cube.geometry = geometry;
      cube.material = material;

      scene.add(cube);
    },
    createScene2AndSendSceneData: function () {
      let scene = new Scene();

      // create cube重复代码

      let geometry = new BoxGeometry();
      let material = new MeshBasicMaterial();

      let cube = new Mesh();
      cube.geometry = geometry;
      cube.material = material;

      geometry = new SphereGeometry();
      material = new MeshBasicMaterial();
      let sphere = new Mesh();
      sphere.geometry = geometry;
      sphere.material = material;

      scene.add(cube);
      scene.add(sphere);

      // 不应该在ui中直接与后端交互
      fetch(serverUrl, scene).then((result) => {
        console.log(result);
      });
    },
  },
});
</script>

<style>
</style>
