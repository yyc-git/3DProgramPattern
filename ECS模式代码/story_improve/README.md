# 如何运行代码

```js
npm run client
```

# 代码说明


值得注意的是：  

- 将“gameObject挂载了哪些组件”的数据放在哪里？它们可以放在GameObjectManager中，也可以分散地放在各个组件的Manager中。考虑到为了方便组件直接就近获得GameObject挂载的其它组件，所以我们选择后者。组件的Manager可以通过“挂载的gameObject”、“gameObject挂载了哪些组件”这两个数据来获得GameObject挂载的其它组件
- 因为“gameObject挂载了哪些组件”的数据（如gameObjectPositionMap）是放在组件的Manager（如PositionComponentManager）中的，所以操作“GameObject和挂载的组件”的代码也放在组件的Manager（如PositionComponentManager）而不是GameObjectManager中
