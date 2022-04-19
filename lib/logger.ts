import type { DestinationStream, LoggerOptions } from 'pino'
import pino from 'pino'
import { logflarePinoVercel } from 'pino-logflare'
import pretty from 'pino-pretty'
import {
  commitSha,
  logDestination,
  logflareApiKey,
  logflareSourceToken,
  logLevel,
  nodeEnv
} from './config'

const config: LoggerOptions = {
  level: logLevel,
  base: {
    env: nodeEnv,
    revision: commitSha
  }
}

let destination: DestinationStream

if (logDestination === 'logflare') {
  const { stream, send } = logflarePinoVercel({
    apiKey: logflareApiKey,
    sourceToken: logflareSourceToken
  })
  config.browser = {
    transmit: {
      level: logLevel,
      send
    }
  }
  destination = stream
} else {
  destination = pretty({
    colorize: true
  })
}

export default pino(config, destination)
