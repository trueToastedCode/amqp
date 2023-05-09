export default function buildMakeBalancedAmqpAccess ({ makeAmqpAccess }) {
  return function makeBalancedAmqpAccess ({ urls, rpcQueue, replyQueue }) {
    const amqpAccessCollection = urls.map(
      (url) => makeAmqpAccess({ url, rpcQueue, replyQueue }))
    if (amqpAccessCollection.length === 1) {
      return Object.freeze({
        amqpAccessCollection,
        choice: () => amqpAccessCollection[0]
      })
    }
    return Object.freeze({
      amqpAccessCollection,
      choice: () => amqpAccessCollection[
        Math.floor(Math.random() * amqpAccessCollection.length)]
    })
  }
}