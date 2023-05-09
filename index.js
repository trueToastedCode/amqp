import processApiResult from '../process-api-result'

import makeDefaultAmqpSend from './default-amqp-send'

export default makeDefaultAmqpSend({ processApiResult })