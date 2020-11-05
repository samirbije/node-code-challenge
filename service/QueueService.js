/* 
  Queue Class which defines basic queue methods
  enqueue, dequeue, isEmpty, peek, length
*/
class QueueService {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue(item) {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length == 0;
  }

  peek() {
    return !this.isEmpty() ? this.items[0] : undefined;
  }

  length() {
    return this.items.length;
  }
}

module.exports = QueueService