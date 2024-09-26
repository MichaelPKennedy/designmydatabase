// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Email, EmailData, EmailPatch, EmailQuery, EmailService } from './email.class'

export type { Email, EmailData, EmailPatch, EmailQuery }

export type EmailClientService = Pick<EmailService, (typeof emailMethods)[number]>

export const emailPath = 'email'

export const emailMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const emailClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(emailPath, connection.service(emailPath), {
    methods: emailMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [emailPath]: EmailClientService
  }
}
