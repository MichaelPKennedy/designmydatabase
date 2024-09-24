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

  // Basic Mermaid syntax check
  private validateMermaidSyntax(mermaidCode: string): boolean {
    // Check if the diagram starts with 'erDiagram'
    if (!mermaidCode.trim().startsWith('erDiagram')) {
      return false
    }

    // Check for basic entity syntax
    const entityRegex = /\w+\s*{[^}]*}/g
    const entities = mermaidCode.match(entityRegex)
    if (!entities || entities.length === 0) {
      return false
    }

    // Check for relationship syntax
    const relationshipRegex =
      /\s*\w+\s+((\|\|)|(\}\|)|(\|\{)|(\}o)|(\|o)|(o\|)|(o\{))--((\|\|)|(\}\|)|(\|\{)|(\}o)|(\|o)|(o\|)|(o\{))\s+\w+\s*(:?\s*"[^"]*")?\s*/g
    const relationships = mermaidCode.match(relationshipRegex)
    if (!relationships || relationships.length === 0) {
      return false
    }

    // Additional check for invalid relationship symbols
    const invalidRelationshipRegex = /\w+\s+\|--\|?\s+\w+/
    if (invalidRelationshipRegex.test(mermaidCode)) {
      return false
    }

    return true
  }

  async find(params: OpenaiParams) {
    const { businessType } = (params.query as { businessType?: string }) || {}

    if (!businessType) {
      throw new Error('Business type is required for suggestions')
    }

    const prompt = `Given a ${businessType} business, suggest:
    1. 5 key roles or types of people involved
    2. 5 important resources or products
    3. 5 main business activities or processes

    Format the response as a JSON object with keys: people, resources, activities.`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user' as const, content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No content received from OpenAI')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Error in OpenAI service (find method):', error)
      throw new Error('Failed to generate suggestions')
    }
  }

  async get(id: Id, params?: OpenaiParams): Promise<Openai> {
    throw new Error('Method not implemented.')
  }

  async create(data: OpenaiData, params?: OpenaiParams): Promise<Openai> {
    const { name, people, resources, activities, summary } = data
    const prompt = `Generate SQL code to create tables and relationships for a business. Here are some details to help you understand the business(these are not the entities, you should create the entities by inference):
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
      erDiagram
          <your Mermaid diagram here>
      \`\`\`

     Ensure the Mermaid diagram:
      1. Uses proper entity names (PascalCase)
      2. Includes all relevant entities
      3. Shows correct relationships using only these symbols: ||--||, }|--|{, }o--o{, ||--o{, ||--|{
      4. Lists key attributes for each entity
      5. Uses descriptive relationship labels in quotes
      6. Ends each relationship definition with a newline character
    `

    const maxRetries = 5
    let attempts = 0

    while (attempts < maxRetries) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user' as const, content: prompt },
            ...(attempts > 0
              ? [
                  {
                    role: 'user' as const,
                    content: 'The previous Mermaid diagram was invalid. Please try again.'
                  }
                ]
              : [])
          ],
          max_tokens: 2000,
          temperature: 0.7,
          n: 1
        })

        const content = response.choices[0]?.message?.content
        if (!content) {
          throw new Error('No content received from OpenAI')
        }

        const sqlCodeMatch = content.match(/```sql\s*([\s\S]*?)\s*```/)
        const mermaidCodeMatch = content.match(/```mermaid\s*([\s\S]*?)\s*```/)

        if (!sqlCodeMatch || !mermaidCodeMatch) {
          throw new Error('Failed to extract SQL or Mermaid code from the response')
        }

        const sqlCode = sqlCodeMatch[1].trim()
        const mermaidCode = mermaidCodeMatch[1].trim()

        if (this.validateMermaidSyntax(mermaidCode)) {
          // TODO: Store response in MongoDB
          return { sqlCode, mermaidCode }
        } else {
          throw new Error('Invalid Mermaid syntax')
        }
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error)
        attempts++

        if (attempts >= maxRetries) {
          throw new Error('Failed to generate valid SQL and Mermaid code after multiple attempts')
        }
      }
    }

    throw new Error('Failed to generate valid SQL and Mermaid code')
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
