import { app } from './app'
import { logger } from './logger'

const port = process.env.PORT || 3030
const host = app.get('host')

logger.info('Starting application...')
logger.info(`Environment: ${process.env.NODE_ENV}`)
logger.info(`Port: ${port}`)
logger.info(`Host: ${host}`)

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

app
  .listen(port)
  .then(() => {
    logger.info(`Feathers app listening on http://${host}:${port}`)
  })
  .catch((error) => {
    logger.error('Failed to start server', error)
  })
