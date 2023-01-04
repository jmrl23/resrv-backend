import * as e from 'env-var'

export const NODE_ENV = e
  .get('NODE_ENV')
  .default('development')
  .asEnum(['development', 'production'])

export const PORT = e.get('PORT').default('3001').asPortNumber()

export const JWT_SECRET = e.get('JWT_SECRET').required().asString()

export const TRUST_PROXY = e.get('TRUST_PROXY').required().asString()

export const AUTH_BYPASS_KEY = e.get('AUTH_BYPASS_KEY').required().asString()

export const ORGANIZATION_EMAIL_DOMAIN = e
  .get('ORGANIZATION_EMAIL_DOMAIN')
  .required()
  .asString()

export const USE_ORGANIZATION_EMAIL_ON_DEVELOPMENT = e
  .get('USE_ORGANIZATION_EMAIL_ON_DEVELOPMENT')
  .default('true')
  .asBool()

export const CLIENT_URL = e.get('CLIENT_URL').required().asUrlString()

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
