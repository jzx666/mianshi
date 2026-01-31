// 题目 4：LRU 缓存实现
// 设计并实现一个 LRU（最近最少使用）缓存结构 LRUCache 类：
// 构造函数接收capacity（缓存最大容量）；
// 实现get(key)方法：获取 key 对应的 value，若 key 不存在返回 - 1；访问后该 key 变为 “最近使用”；
// 实现put(key, value)方法：插入 / 更新 key-value，若容量满则删除 “最近最少使用” 的 key，再插入；
// 要求：get 和 put 方法的时间复杂度均为 O (1)。

// 哈希表 + 双向链表
// 哈希表记录 key 的位置
// 双向链表记录 key 的顺序

// 定义双向链表节点类
class ListNode {
    constructor(key, value) {
        this.key = key; // 存储key，方便删除哈希表时快速定位
        this.value = value;
        this.prev = null; // 前驱节点
        this.next = null; // 后继节点
    }
}

// LRU缓存类
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity; // 缓存最大容量
        this.size = 0; // 当前缓存元素数量
        this.cache = new Map(); // 哈希表：key -> ListNode
        
        // 虚拟头/尾节点（简化边界处理，无需判断节点是否为头/尾）
        this.head = new ListNode(-1, -1);
        this.tail = new ListNode(-1, -1);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }


    moveToHead(node) {
        // 先删除节点原有位置
        this.removeNode(node);
        // 插入到头部
        this.addToHead(node);
    }


    removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }


    addToHead(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }


    removeTail() {
        const lruNode = this.tail.prev;
        this.removeNode(lruNode);
        return lruNode;
    }


    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        const node = this.cache.get(key);
        this.moveToHead(node); // 移动到头部，标记为最近使用
        return node.value;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            // key已存在：更新值 + 移动到头部
            const node = this.cache.get(key);
            node.value = value;
            this.moveToHead(node);
        } else {
            // key不存在：创建新节点
            const newNode = new ListNode(key, value);
            this.cache.set(key, newNode);
            this.addToHead(newNode);
            this.size++;

            // 超出容量：删除LRU节点
            if (this.size > this.capacity) {
                const lruNode = this.removeTail();
                this.cache.delete(lruNode.key); // 同步删除哈希表中的映射
                this.size--;
            }
        }
    }
}

// 测试用例
const lruCache = new LRUCache(2);
lruCache.put(1, 1); // 缓存：{1=1}
lruCache.put(2, 2); // 缓存：{1=1, 2=2}
console.log(lruCache.get(1));  // 返回 1，缓存：{2=2, 1=1}（1变为最近使用）
lruCache.put(3, 3); // 容量满，删除LRU的2，缓存：{1=1, 3=3}
console.log(lruCache.get(2));  // 返回 -1（已被删除）
lruCache.put(4, 4); // 容量满，删除LRU的1，缓存：{3=3, 4=4}
console.log(lruCache.get(1));  // 返回 -1（已被删除）
console.log(lruCache.get(3));  // 返回 3，缓存：{4=4, 3=3}
console.log(lruCache.get(4));  // 返回 4，缓存：{3=3, 4=4}