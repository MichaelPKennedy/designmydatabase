import { app } from './app'
import { logger } from './logger'

const port = process.env.PORT || 3030
const host = process.env.HOST || '0.0.0.0'

app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${host}:${port}`)
})
