export default function makeListenReactAmqp ({ amqp, makeAmqpCallback }) {
  return function listenReactAmqp ({ url, queue, controllers, healthyCallback } = {}) {
    console.log('Connecting server...')
    amqp.connect(url, (connectionError, connection) => {
      if (connectionError) {
        throw new Error(connectionError)
      }
      connection.createChannel((channelError, channel) => {
        if (channelError) {
          throw new Error(channelError)
        }
        channel.assertQueue(queue);
        const amqpCallback = makeAmqpCallback({ channel, controllers })
        if (healthyCallback != null) {
          healthyCallback()
        }
        console.log(`Server is listening on queue ${queue}`)
        channel.consume(queue, amqpCallback)
      })
    })
  }
}