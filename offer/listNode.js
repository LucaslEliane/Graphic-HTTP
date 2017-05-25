var NodeList = (function() {
    var firstNode

    const Node = function(data, next) {
        this.data = data
        this.next = next
    }

    function createNodeList(data) {
        firstNode = new Node(data, null)
    }

    function addNodeInHead(data) {
        var temp = firstNode
        firstNode = new Node(data, null)
        firstNode.next = temp
    }

    function getFirstNode() {
        return firstNode
    }

    function printList() {
        var arr = [],
            node = firstNode
        
        while(node.next !== null) {
            arr.push(node.data)
            node = node.next
        }

        arr.push(node.data)
        return arr.reverse()
    }
    return {
        createNodeList: createNodeList,
        addNodeInHead: addNodeInHead,
        getFirstNode: getFirstNode,
        printList: printList
    }
})

var nodeList = new NodeList()

nodeList.createNodeList(1)
nodeList.addNodeInHead(2)
nodeList.addNodeInHead(3)
nodeList.addNodeInHead(4)
nodeList.addNodeInHead(5)
nodeList.addNodeInHead(6)
nodeList.addNodeInHead(7)

console.log(nodeList.printList())