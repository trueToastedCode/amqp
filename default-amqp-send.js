export default function buildMakeDefaultAmqpSend ({ processApiResult }) {
  return function makeDefaultAmqpSend ({ sendRPCMessage }) {
    return async function defaultAmqpSend ({
      controllerName, args, timeoutMs, expectedStatusCode = 200
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
}