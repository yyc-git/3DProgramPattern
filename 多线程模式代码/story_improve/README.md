
值得注意的是：
TransformComponent、BasicMaterialComponent这两个组件的Buffer是SharedArrayBuffer
因为只有SharedArrayBuffer而非ArrayBuffer才能在线程之间共享




值得注意的是：
因为使用了浏览器的SharedArrayBuffer API，所以需要启用浏览器的“跨域隔离”，打开Cross Origin

具体实现是在webpack的配置文件中定义下面的代码：
webpack.config.devserver.js
```ts
    devServer: {
        ...
        headers: {
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin"
        },
        ...
    },
```


