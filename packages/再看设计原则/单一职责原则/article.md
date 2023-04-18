# 定义

只有一个原因引起变化，或者说一次只做一件事情


# 补充说明

如果一个模块或者函数做了多件事情，那么应该将其拆分

从函数名上就能看出该函数是否符合单一职责原则，如getAndSetData这个函数名一看就知道做了两件事情，所以应该将其拆分为getData、setData这两个函数


如果一个模块或者函数做了多件事情，有下面的缺点：

- 任何一件事情的变化都会影响它
- 用户调用它时，本来只预期它做某件事情，结果它实际上还做了其它的事情，这可能造成不可预料的bug


# 案例1

TODO tu
上图是操作书的接口，它不符合单一职责原则
这是因为它的getBookID、setBookID函数是对书的数据的操作，而它的addBook函数则是对书的行为的操作

应该将其拆分为两个接口，拆分后的接口如下图所示：
TODO tu

BookData负责操作书的数据
BookAction负责操作书的行为
原来的BookInfo改为实现BookData和BookAction


# 案例2



```ts
type userName = string

type phone = number

type changeUser = (newUserData: [userName, phone]) => void
```
上面代码是一个函数的签名
从签名可知，该函数不符合单一职责原则，这是因为它的形参是一个元组，包含了多个新的用户值，这说明该函数做了多件事情

应该将其拆分为多个函数，拆分后的函数签名如下所示：
```ts
type userName = string

type phone = number

type changeUserName = (newUserName: userName) => void
type changePhone = (newPhone: phone) => void
```





