// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const emailSchema = Type.Object(
  {
    name: Type.String(),
    email: Type.String(),
    message: Type.String()
  },
  { $id: 'Email', additionalProperties: false }
)
export type Email = Static<typeof emailSchema>
export const emailValidator = getValidator(emailSchema, dataValidator)
export const emailResolver = resolve<Email, HookContext>({})

export const emailExternalResolver = resolve<Email, HookContext>({})

// Schema for creating new entries
export const emailDataSchema = Type.Object(
  {
    name: Type.String(),
    email: Type.String(),
    message: Type.String()
  },
  { $id: 'EmailData' }
)
export type EmailData = Static<typeof emailDataSchema>
export const emailDataValidator = getValidator(emailDataSchema, dataValidator)
export const emailDataResolver = resolve<Email, HookContext>({})

// Schema for updating existing entries
export const emailPatchSchema = Type.Partial(emailSchema, {
  $id: 'EmailPatch'
})
export type EmailPatch = Static<typeof emailPatchSchema>
export const emailPatchValidator = getValidator(emailPatchSchema, dataValidator)
export const emailPatchResolver = resolve<Email, HookContext>({})

// Schema for allowed query properties
const emailQueryProperties = Type.Pick(emailSchema, ['name', 'email', 'message'])
export const emailQuerySchema = Type.Intersect(
  [
    querySyntax(emailQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type EmailQuery = Static<typeof emailQuerySchema>
export const emailQueryValidator = getValidator(emailQuerySchema, queryValidator)
export const emailQueryResolver = resolve<EmailQuery, HookContext>({})
