import type { Logger, LoggerOptions } from 'pino'
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
    revision: commitSha
  }
}

let logger: Logger

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
  logger = pino(config, stream)
} else {
  logger = pino(config)
}

export default logger
