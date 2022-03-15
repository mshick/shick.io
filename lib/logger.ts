import type { LoggerOptions, DestinationStream } from 'pino'
import pino from 'pino'
import { logflarePinoVercel } from 'pino-logflare'
import {
  nodeEnv,
  logflareApiKey,
  logflareSourceToken,
  logLevel,
  logDestination,
  commitSha,
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
  console.log(logDestination)
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
