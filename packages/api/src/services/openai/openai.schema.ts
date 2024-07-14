import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const openaiSchema = Type.Object(
  {
    post_id: Type.Number(),
    title: Type.String(),
    category: Type.String(),
    content: Type.String(),
    author: Type.String(),
    created_at: Type.String(),
    updated_at: Type.String()
  },
  { $id: 'Openai', additionalProperties: false }
)
export type Openai = Static<typeof openaiSchema>
export const openaiValidator = getValidator(openaiSchema, dataValidator)
export const openaiResolver = resolve<Openai, HookContext>({})

export const openaiExternalResolver = resolve<Openai, HookContext>({})

// Schema for creating new entries
export const openaiDataSchema = Type.Object(
  {
    title: Type.String(),
    category: Type.String(),
    content: Type.String(),
    author: Type.String()
  },
  { $id: 'OpenaiData', additionalProperties: false }
)
export type OpenaiData = Static<typeof openaiDataSchema>
export const openaiDataValidator = getValidator(openaiDataSchema, dataValidator)
export const openaiDataResolver = resolve<Openai, HookContext>({})

// Schema for updating existing entries
export const openaiPatchSchema = Type.Partial(openaiDataSchema, {
  $id: 'OpenaiPatch'
})
export type OpenaiPatch = Static<typeof openaiPatchSchema>
export const openaiPatchValidator = getValidator(openaiPatchSchema, dataValidator)
export const openaiPatchResolver = resolve<Openai, HookContext>({})

// Schema for allowed query properties
export const openaiQueryProperties = Type.Pick(openaiSchema, ['post_id', 'title', 'category', 'author'])
export const openaiQuerySchema = Type.Intersect(
  [
    querySyntax(openaiQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type OpenaiQuery = Static<typeof openaiQuerySchema>
export const openaiQueryValidator = getValidator(openaiQuerySchema, queryValidator)
export const openaiQueryResolver = resolve<OpenaiQuery, HookContext>({})
