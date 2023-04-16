export default function processApiResult ({ result, expectedStatusCode, throwError = true }) {
  if (!result) {
    throw new Error(`Result doesn't exist`)
  }
  result = JSON.parse(result)
  if (throwError && result.statusCode !== expectedStatusCode) {
    throw new Error(result.body.error)
  }
  return result
}