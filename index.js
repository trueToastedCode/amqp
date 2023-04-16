import EventEmitter from 'events'

import amqp from 'amqplib/callback_api'

import Id from '../Id'
import timeout from '../timeout'

import buildMakeAmqpAccess from './base-amqp-access'

export default buildMakeAmqpAccess({ amqp, EventEmitter, Id, timeout })