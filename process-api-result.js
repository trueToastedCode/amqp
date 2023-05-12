export default function makeProcessApiResult ({ CustomError }) {
  return function processApiResult ({ result, expectedStatusCode, throwError = true }) {
    if (!result) {
      throw new Error(`Result doesn't exist`)
    }
    result = JSON.parse(result)
    if (throwError && result.statusCode !== expectedStatusCode) {
      throw new CustomError(result.error ?? 'An unknown error occured', result.statusCode)
    }
    return result
  }
}