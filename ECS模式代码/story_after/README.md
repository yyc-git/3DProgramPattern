
这里与之前一样，我们将一个GameObject的数据保存在一个state中，然后用一个索引与其关联。具体就是：
gameObject其实就是一个number类型的id值，
gameObjectState保存了一个GameObject的数据
gameObject与gameObjectState一一关联，这个关联体现在前者是WorldState->gameObjects这个Hash Map的Key，后者是它的Value

<!-- World封装了操作GameObject和组件的API -->




组件与GameObject一样，我们将它的数据保存在一个state中，只是不需要索引。所以一个组件就等于一个组件state