// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { EmailService } from './email.class'
import { emailPath, emailMethods } from './email.shared'
import { EmailHooks } from './email.hooks'

export * from './email.class'
export * from './email.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const email = (app: Application) => {
  // Register our service on the Feathers application
  const sequelizeClient = app.get('sequelizeClient' as any)
  app.use(emailPath, new EmailService(app, sequelizeClient), {
    // A list of all methods this service exposes externally
    methods: emailMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })

  // Initialize hooks
  app.service(emailPath).hooks(EmailHooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [emailPath]: EmailService
  }
}
