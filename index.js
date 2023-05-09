import makeAmqpAccess from '../base-amqp-access'

import buildMakeBalancedAmqpAccess from './balanced-amqp-access'

export default buildMakeBalancedAmqpAccess({ makeAmqpAccess })