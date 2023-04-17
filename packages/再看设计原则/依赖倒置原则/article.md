# 定义

高层模块不应该依赖低层模块，两者都应该依赖其抽象
抽象不应该依赖细节
细节应该依赖抽象


# 补充说明

<!-- 如何分辨高层模块、低层模块？ -->
所谓的高层、低层模块是按照依赖的方向来定的，如模块1依赖模块2，则我们说模块1属于高层模块，模块2属于低层模块


<!-- 在代码中，抽象、细节在代码中指的是什么？ -->
模块间应该抽象依赖于抽象
实现模块之间不应该发生直接的依赖关系，其依赖关系应该是通过接口产生的； 
接口不依赖于实现模块； 
实现模块依赖接口

所以说，符合依赖倒置原则的编程可以看作是“面向接口编程”


符合依赖倒置原则有下面的好处：
- 减少模块之间的耦合性
- 便于替换细节
- 提高系统的稳定性
- 降低并行开发引起的风险
- 提高代码的可读性和可维护性



# 案例1

TODO tu
上图是读者阅读技术书的领域模型

相关伪代码如下：
TechnicalBook
```ts
type technicalBook = {
    getContent: () => string
}

export let TechnicalBook: technicalBook = {
    getContent: () => {
        return "技术书的内容"
    }
}
```
Reader
```ts
export let read = (technicalBook: technicalBook) => {
    let content = technicalBook.getContent()

    ...
}
```
Client
```ts
Reader.read(TechnicalBook)
```

如果增加小说书，读者既可以阅读技术书又可以阅读小说书，具体由Client决定让读者阅读哪本书
修改后的领域模型如下：
TODO tu

修改后的相关伪代码如下：
TechnicalBook代码不变

NovelBook
```ts
type novelBook = {
    getContent: () => string
}

export let NovelBook: novelBook = {
    getContent: () => {
        return "小说书的内容"
    }
}
```
Reader
```ts
export let read = (technicalBook: technicalBook, novelBook: novelBook, needReadBook: string) => {
    let content = null

    switch (needReadBook) {
        case "technical":
            content = technicalBook.getContent()
            break
        case "novel":
        default:
            content = novelBook.getContent()
            break
    }

    ...
}
```
Client
```ts
//选择让读者读小说书
Reader.read(TechnicalBook, NovelBook, "novel")
```

我们可以看到，每增加一本书，Reader都会受影响
我们将其改为符合依赖倒置原则，从而使Reader不受影响
修改后的领域模型如下：
TODO tu

现在Reader改为依赖Book这个接口，而不再依赖它的具体实现模块了
这样做的好处是只要Book这个接口不变，它的实现模块的变化不会影响到Reader


修改后的相关伪代码如下：
Book
```ts
export interface Book {
    getContent(): string
}
```
TechnicalBook
```ts
export let TechnicalBook: Book = {
    getContent: () => {
        return "技术书的内容"
    }
}
```
NovelBook
```ts
export let NovelBook: Book = {
    getContent: () => {
        return "小说书的内容"
    }
}
```
Reader
```ts
export let read = (book: Book) => {
    let content = book.getContent()

    ...
}
```
Client
```ts
//选择让读者读小说书
Reader.read(NovelBook)
```

<!-- 





# 案例2 -->