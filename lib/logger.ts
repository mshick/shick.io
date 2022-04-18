import type { DestinationStream, LoggerOptions } from 'pino'
import pino from 'pino'
import { logflarePinoVercel } from 'pino-logflare'
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
    revision: commitSha,
  },
}

let destination: DestinationStream

if (logDestination === 'logflare') {
  const { stream, send } = logflarePinoVercel({
    apiKey: logflareApiKey,
    sourceToken: logflareSourceToken,
  })
  config.browser = {
    transmit: {
      level: logLevel,
      send,
    },
  }
  destination = stream
} else {
  config.prettyPrint = { colorize: true }
}

export default pino(config, destination)
