import * as e from 'env-var'

export const NODE_ENV = e
  .get('NODE_ENV')
  .default('development')
  .asEnum(['development', 'production', 'test'])

export const PORT = e.get('PORT').default('3001').asPortNumber()

export const JWT_SECRET = e.get('JWT_SECRET').required().asString()

export const TRUST_PROXY = e.get('TRUST_PROXY').required().asString()

export const AUTHORIZATION_KEY = e
  .get('AUTHORIZATION_KEY')
  .required()
  .asString()

export const BYPASS_AUTHORIZATION_ON_DEVELOPMENT = e
  .get('BYPASS_AUTHORIZATION_ON_DEVELOPMENT')
  .default('false')
  .asBool()

export const ORGANIZATION_EMAIL_DOMAIN = e
  .get('ORGANIZATION_EMAIL_DOMAIN')
  .required()
  .asString()

export const BYPASS_ORGANIZATION_EMAIL_FILTER_ON_DEVELOPMENT = e
  .get('BYPASS_ORGANIZATION_EMAIL_FILTER_ON_DEVELOPMENT')
  .default('false')
  .asBool()

export const CLIENT_URL = e.get('CLIENT_URL').required().asUrlString()

export const CORS_WHITELIST = e.get('CORS_WHITELIST').required().asArray(',')

export const GOOGLE_CLIENT_ID = e.get('GOOGLE_CLIENT_ID').required().asString()

export const DATABASE_URL = e.get('DATABASE_URL').required().asUrlString()

export const GOOGLE_CLIENT_SECRET = e
  .get('GOOGLE_CLIENT_SECRET')
  .required()
  .asString()

export const GOOGLE_REFRESH_TOKEN = e
  .get('GOOGLE_REFRESH_TOKEN')
  .required()
  .asString()

export const GOOGLE_PLAYGROUND_URL = e
  .get('GOOGLE_PLAYGROUND_URL')
  .required()
  .asUrlString()

export const GOOGLE_DRIVE_FOLDER_ID = e
  .get('GOOGLE_DRIVE_FOLDER_ID')
  .required()
  .asString()

export const PASSPORT_GOOGLE_CALLBACK_URL = e
  .get('PASSPORT_GOOGLE_CALLBACK_URL')
  .required()
  .asString()

export const SMTP_TRANSPORT_URL = e
  .get('SMTP_TRANSPORT_URL')
  .required()
  .asUrlObject()
