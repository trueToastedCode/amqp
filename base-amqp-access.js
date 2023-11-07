export default function buildMakeAmqpAccess ({ amqp, EventEmitter, Id, timeout }) {
  return function makeAmqpAccess ({ url, rpcQueue, replyQueue, defaultTimeoutMs = 30000 }) {
    const channelPromise = new Promise(resolve => {
      amqp.connect(url, (connectionError, connection) => {
        if (connectionError) {
          throw new Error(connectionError)
        }
        connection.createChannel(function (channelError, channel) {
          if (channelError) {
            throw new Error(channelError)
          }
          channel.responseEmitter = new EventEmitter()
          channel.responseEmitter.setMaxListeners(0)
          channel.consume(
            replyQueue,
            message => {
              channel.responseEmitter.emit(
                message.properties.correlationId,
                message.content.toString()
              )
            },
            { noAck: true }
          )
          resolve(channel)
        })
      })
    })
    return async function sendRPCMessage ({ message, timeoutMs = defaultTimeoutMs }) {
      const channel = await channelPromise
      return await timeout({
        promise: new Promise(resolve => {
          const correlationId = Id.createId()
          channel.responseEmitter.once(correlationId, resolve)
          channel.sendToQueue(
            rpcQueue,
            Buffer.from(message), {
              correlationId,
              replyTo: replyQueue,
              expiration: (timeoutMs == null || timeoutMs <= 0) ? null : timeoutMs
            }
          )
        }),
        ms: timeoutMs
      })
    }
  }
}