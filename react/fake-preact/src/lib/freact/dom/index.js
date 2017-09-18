/**
 * 创建原生 node 节点
 */
export function createNode(nodeName) {
  let node = document.createElement(nodeName);
  node.normalizedNodeName = nodeName;
  return node;
}

/**
 * 给 node 节点设置属性
 * @param {Element} node node节点
 * @param {String} name 属性名
 * @param {*} value 属性值
 */
export function setAccessor(node, name, value) {
  if (name === 'className') {
    name = 'class'
  };
  // 如果是事件
  if (name[0] === 'o') {
    name = name.toLowerCase().substring(2);
    if (value) {
      node.addEventListener(name, eventProxy);
    }
    // 将事件存放到 _listeners 变量中
    (node._listeners || (node._listeners = {}))[name] = value;
  }
}

function eventProxy(e) {
  // e.type 会是事件名，这里就实现了调用声明的函数
  this._listeners[e.type](e);
}