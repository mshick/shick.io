import pino, { type LoggerOptions } from 'pino';
import { commitSha, isDevelopment, logLevel, vercelEnv } from './env';

const config: LoggerOptions = {
  level: logLevel,
  base: {
    env: vercelEnv,
    revision: commitSha,
  },
};

if (isDevelopment) {
  config.transport = {
    target: 'pino-pretty',
    options: { colorize: true },
  };
}

export default pino(config);
