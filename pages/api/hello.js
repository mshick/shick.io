// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import logger from 'lib/logger'

export default function handler(req, res) {
  logger.info('hello from API')
  res.status(200).json({ name: 'John Doe' })
}
