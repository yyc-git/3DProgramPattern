# 如何运行代码

```js
npm run webpack:dev-server
```

# 代码说明

值得注意的是：  
TransformComponent、BasicMaterialComponent这两个组件的Buffer是ArrayBuffer而不是SharedArrayBuffer。这是因为：

- 目前只是单线程，不需要在线程之间共享Buffer
- ArrayBuffer的兼容性更好