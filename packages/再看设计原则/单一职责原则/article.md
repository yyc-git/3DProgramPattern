# 定义

只有一个原因引起变化；
一次只做一件事情

<!-- # 解释定义 -->



# 补充说明

如果一个模块或者函数做了多件事情，那么应该将其拆分

从函数名上就能看出该函数是否符合单一职责原则，如getAndSetData这个函数名一看就知道做了两件事情，所以应该将其拆分为getData、setData这两个函数


如果一个函数做了多件事情，有下面的缺点：

- 任何一件事情的变化都会影响该函数
- 用户调用该函数时，本能只预期它做某件事情，结果它实际上还做了其它的事情，这可能造成bug


# 案例1

TODO tu
上图是操作书的接口，它不符合单一职责原则。
这是因为它的getBookID、setBookID是书的数据的操作，而它的addBook是书的行为的操作

应该将其拆分为两个接口，拆分后的接口如下图所示：
TODO tu

BookData负责书的数据
BookAction负责书的行为
BookInfo实现BookData和BookAction


# 案例2



```ts
type userName = string

type phone = number

type changeUser = (newUserData: [userName, phone]) => void
```
上面是一个函数的签名
从签名可知，该函数不符合单一职责原则
这是因为它的形参是一个数组，它包含了多个修改用户的的值，这说明该函数做了多件事情

应该将其拆分为多个函数，拆分后的函数如下所示：
```ts
type userName = string

type phone = number

type changeUserName = (newUserName: userName) => void
type changePhone = (newPhone: phone) => void
```





