// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const openaiSchema = Type.Object(
  {
    id: Type.Optional(Type.Number()),
    sqlCode: Type.String(),
    mermaidCode: Type.String()
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
    entities: Type.Array(
      Type.Object({
        name: Type.String(),
        attributes: Type.Array(Type.String())
      })
    )
  },
  { $id: 'OpenaiData', additionalProperties: false }
)
export type OpenaiData = Static<typeof openaiDataSchema>
export const openaiDataValidator = getValidator(openaiDataSchema, dataValidator)
export const openaiDataResolver = resolve<Openai, HookContext>({})

// Schema for updating existing entries
export const openaiPatchSchema = Type.Partial(openaiSchema, {
  $id: 'OpenaiPatch'
})
export type OpenaiPatch = Static<typeof openaiPatchSchema>
export const openaiPatchValidator = getValidator(openaiPatchSchema, dataValidator)
export const openaiPatchResolver = resolve<Openai, HookContext>({})

// Schema for allowed query properties
export const openaiQueryProperties = Type.Pick(openaiSchema, ['id', 'sqlCode', 'mermaidCode'])
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
