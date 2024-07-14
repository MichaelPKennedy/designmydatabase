// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Openai, OpenaiData, OpenaiPatch, OpenaiQuery, OpenaiService } from './openai.class'

export type { Openai, OpenaiData, OpenaiPatch, OpenaiQuery }

export type OpenaiClientService = Pick<OpenaiService, (typeof openaiMethods)[number]>

export const openaiPath = 'openai'

export const openaiMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const openaiClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(openaiPath, connection.service(openaiPath), {
    methods: openaiMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [openaiPath]: OpenaiClientService
  }
}
