
# 定义

只有一个原因引起变化，或者说一次只做一件事情


# 补充说明

如果一个模块或者函数做了多件事情，那么应该将其拆分

从函数名上就能看出一个函数是否符合单一职责原则，如“getAndSetData”这个函数名一看就知道做了两件事情，应该将其拆分为getData、setData这两个函数

如果一个模块或者函数做了多件事情，有下面的缺点：

- 任何一件事情的变化都会影响它
- 用户调用它时，本来只预期它做某件事情，结果它实际上还做了其它的事情，这可能造成不可预料的bug


# 案例1

![书的接口图](./1.png)

上图是操作书的接口，它不符合单一职责原则。这是因为它的getBookID、setBookID函数是对书的数据的操作，而它的addBook函数则是对书的行为的操作，所以该接口做了两件事情

应该将其拆分为两个接口，使每个接口只做一件事情。拆分后的接口如下图所示：
![重构后的书的接口图](./2.png)

BookData接口负责操作书的数据。BookAction接口负责操作书的行为。原来的BookInfo接口改为实现BookData接口和BookAction接口


# 案例2

```ts
type userName = string

type phone = number

type changeUser = (newUserData: [userName, phone]) => void
```
上面的代码是函数（changeUser）的签名。从签名可知，该函数不符合单一职责原则，这是因为它的形参是一个元组，包含了多个数据，这说明该函数做了多件事情。

应该将其拆分为多个函数，使每个函数只做一件事情。拆分后的函数签名如下所示：
```ts
type userName = string

type phone = number

type changeUserName = (newUserName: userName) => void
type changePhone = (newPhone: phone) => void
```





