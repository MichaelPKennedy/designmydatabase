// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { OpenaiService } from './openai.class'
import { openaiPath, openaiMethods } from './openai.shared'
import { openaiHooks } from './openai.hooks'

export * from './openai.class'
export * from './openai.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const openai = (app: Application) => {
  // Register our service on the Feathers application
  const sequelizeClient = app.get('sequelizeClient' as any)
  app.use(openaiPath, new OpenaiService(app, sequelizeClient), {
    // A list of all methods this service exposes externally
    methods: openaiMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })

  // Initialize hooks
  app.service(openaiPath).hooks(openaiHooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [openaiPath]: OpenaiService
  }
}
