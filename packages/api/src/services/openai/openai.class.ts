import type { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import type { Openai, OpenaiData, OpenaiPatch, OpenaiQuery } from './openai.schema'

export type { Openai, OpenaiData, OpenaiPatch, OpenaiQuery }

export interface OpenaiParams extends Params {
  query?: {}
}

export class OpenaiService implements ServiceMethods<any> {
  app: Application
  sequelize: any

  constructor(app: Application, sequelizeClient: any) {
    this.app = app
    this.sequelize = sequelizeClient
  }

  async find(params: OpenaiParams): Promise<Openai[] | Paginated<Openai>> {
    throw new Error('Method not implemented.')
  }

  async get(id: Id, params?: OpenaiParams): Promise<Openai> {
    throw new Error('Method not implemented.')
  }

  async create(data: OpenaiData, params?: OpenaiParams): Promise<Openai> {
    throw new Error('Method not implemented.')
  }

  async update(id: NullableId, data: OpenaiData, params?: OpenaiParams): Promise<Openai> {
    throw new Error('Method not implemented.')
  }
  async patch(id: NullableId, data: OpenaiPatch, params?: OpenaiParams): Promise<Openai> {
    throw new Error('Method not implemented.')
  }

  async remove(id: NullableId, params?: OpenaiParams): Promise<Openai> {
    throw new Error('Method not implemented.')
  }
}
