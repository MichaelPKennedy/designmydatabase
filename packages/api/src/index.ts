import { app } from './app'
import { logger } from './logger'

const port = 3030
const host = app.get('host')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

app.listen(port, '0.0.0.0', function () {
  logger.info(`Feathers app listening on http://${host}:${port}`)
})
