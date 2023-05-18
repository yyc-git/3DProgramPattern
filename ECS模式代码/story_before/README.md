# 如何运行代码

```js
npm run client
```

# 代码说明

我们将一个英雄的数据保存在一个state中，然后用一个索引与其关联。具体就是：  

- normalHero、superHero其实就是一个number类型的id值
- normalHeroState、superHeroState分别保存了一个普通英雄、一个超级英雄的数据（比如position、velocity）
- normalHero与normalHeroState一一关联，这个关联体现在前者是WorldState->normalHeroes这个Hash Map的Key，后者是它的Value
- 同理，superHero与superHeroState关联 

