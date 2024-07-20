import type { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import type { Openai, OpenaiData, OpenaiPatch, OpenaiQuery } from './openai.schema'

export type { Openai, OpenaiData, OpenaiPatch, OpenaiQuery }

import dotenv from 'dotenv'
dotenv.config()

import OpenAI from 'openai'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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
    const { name, people, resources, activities, summary } = data
    const prompt = `Generate SQL code to create tables and relationships for the following business details:
      Business Name: ${name}
      Main People: ${people.join(', ')}
      Resources, Products, or Services: ${resources.join(', ')}
      Business Activities: ${activities.join(', ')}
      Business Summary: ${summary}

      Please provide the response in the following format:
      SQL Code:
      \`\`\`sql
      <your SQL code here>
      \`\`\`

      Mermaid Diagram:
      \`\`\`mermaid
      <your Mermaid diagram here>
      \`\`\`
`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000
      })

      const description = response.choices[0]?.message?.content || ''

      const sqlCodeMatch = description.match(/```sql\s*([\s\S]*?)\s*```/)
      const mermaidCodeMatch = description.match(/```mermaid\s*([\s\S]*?)\s*```/)

      const sqlCode = sqlCodeMatch ? sqlCodeMatch[1].trim() : 'Error generating SQL code'
      const mermaidCode = mermaidCodeMatch ? mermaidCodeMatch[1].trim() : 'Error generating Mermaid code'

      // TODO: Store response in MongoDB
      return { sqlCode, mermaidCode }
    } catch (aiError) {
      console.error('Error generating description:', aiError)
      return { sqlCode: 'Error generating SQL code', mermaidCode: 'Error generating Mermaid code' }
    }
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
