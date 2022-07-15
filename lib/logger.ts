import pino, { LoggerOptions } from 'pino'
import { commitSha, isProduction, logLevel, vercelEnv } from './config'

const config: LoggerOptions = {
  level: logLevel,
  base: {
    env: vercelEnv,
    revision: commitSha
  }
}

if (!isProduction) {
  config.transport = {
    target: 'pino-pretty',
    options: { colorize: true }
  }
}

export default pino(config)
