import type { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import type { Email, EmailData, EmailPatch, EmailQuery } from './email.schema'

export type { Email, EmailData, EmailPatch, EmailQuery }
import sgMail from '@sendgrid/mail'

import dotenv from 'dotenv'
dotenv.config()
const apiKey = process.env.SENDGRID_API_KEY
const fromEmail = process.env.FROM_EMAIL || ''
const toEmail = process.env.TO_EMAIL || ''
if (!apiKey) {
  throw new Error('SENDGRID_API_KEY is not defined')
}

sgMail.setApiKey(apiKey)

export interface EmailParams extends Params {
  query?: {}
}

export class EmailService implements ServiceMethods<any> {
  app: Application
  sequelize: any

  constructor(app: Application, sequelizeClient: any) {
    this.app = app
    this.sequelize = sequelizeClient
  }

  async find(params: EmailParams) {
    throw new Error('Method not implemented.')
  }

  async get(id: Id, params?: EmailParams): Promise<Email> {
    throw new Error('Method not implemented.')
  }

  async create(data: EmailData, params?: EmailParams): Promise<Email> {
    const { name, email, message } = data

    const htmlContent = `
      <h1>New Contact Form Submission</h1>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
    `

    const msg = {
      to: toEmail,
      from: { email: fromEmail, name: 'DesignMyDatabase' },
      subject: 'New Contact Form Submission',
      text: 'New Contact Form Submission',
      html: htmlContent
    }

    try {
      await sgMail.send(msg)
      return { email: msg.to, name: '', message: 'Email sent successfully' }
    } catch (error) {
      console.error('Error sending email:', error)
      throw new Error('Failed to send email')
    }
  }

  async patch(id: Id, data: EmailPatch, params?: EmailParams): Promise<Email> {
    throw new Error('Method not implemented.')
  }

  async remove(id: Id, params?: EmailParams): Promise<Email> {
    throw new Error('Method not implemented.')
  }

  async update(id: Id, data: EmailData, params?: EmailParams): Promise<Email> {
    throw new Error('Method not implemented.')
  }
}
