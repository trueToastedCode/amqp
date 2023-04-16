import amqp from 'amqplib/callback_api'

import makeAmqpCallback from '../amqp-callback'

import makeListenReactAmqp from './listen-react-amqp'

export default makeListenReactAmqp({ amqp, makeAmqpCallback })