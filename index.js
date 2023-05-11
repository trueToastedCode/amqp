export default function makeAmqpCallback ({ channel, controllers }) {
  return async function amqpCallback (rabbitMessage) {
    let result
    try {
      // parse controller and args from message
      const message = rabbitMessage.content.toString()
      const i = message.indexOf('{')
      const functionName = i == -1 ? message : message.substring(0, i)
      // get controller
      const chosen = controllers[functionName]
      if (chosen) {
        // parse arguments
        let params
        try {
          params = i == -1 ? {} : JSON.parse(message.substring(i))
        } catch (e) {
          // failed to parse arguments
          result = {
            statusCode: 400,
            body: { error: 'Invalid controller parameters' }
          }
        }
        if (!result) {
          // call controller
          try {
            result = await chosen(params)
          } catch (e) {
            // controller failed
            result = {
              statusCode: 500,
              body: { error: 'An unkown error occurred' }
            }
          }
        }
      } else {
        // controller doesn't exist
        result = {
          statusCode: 400,
          body: { error: `Invalid controller function: ${functionName}` }
        }
      }
    } catch (e) {
      // failed to parse message
      result = {
        statusCode: 400,
        body: { error: 'Invalid message' }
      }
    }
    // send result
    channel.sendToQueue(
      rabbitMessage.properties.replyTo,
      Buffer.from(JSON.stringify(result)),
      { correlationId: rabbitMessage.properties.correlationId }
    )
    channel.ack(rabbitMessage)
  }
}