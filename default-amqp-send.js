export default function makeDefaultAmqpSend ({ processApiResult }) {
  return async function defaultAmqpSend ({
    controllerName, args, timeoutMs, expectedStatusCode = 200, sendRPCMessage
  } = {}) {
    const result = processApiResult({
      result: await sendRPCMessage({
        message: `${controllerName}${JSON.stringify(args)}`,
        timeoutMs
      }),
      expectedStatusCode
    })
    return result.body
  }
}