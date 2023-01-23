"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTP_TRANSPORT_URL = exports.PASSPORT_GOOGLE_CALLBACK_URL = exports.GOOGLE_DRIVE_FOLDER_ID = exports.GOOGLE_PLAYGROUND_URL = exports.GOOGLE_REFRESH_TOKEN = exports.GOOGLE_CLIENT_SECRET = exports.DATABASE_URL = exports.GOOGLE_CLIENT_ID = exports.CORS_WHITELIST = exports.CLIENT_URL = exports.BYPASS_ORGANIZATION_EMAIL_FILTER_ON_DEVELOPMENT = exports.ORGANIZATION_EMAIL_DOMAIN = exports.BYPASS_AUTHORIZATION_ON_DEVELOPMENT = exports.AUTHORIZATION_KEY = exports.TRUST_PROXY = exports.JWT_SECRET = exports.PORT = exports.NODE_ENV = void 0;
const e = __importStar(require("env-var"));
exports.NODE_ENV = e
    .get('NODE_ENV')
    .default('development')
    .asEnum(['development', 'production', 'test']);
exports.PORT = e.get('PORT').default('3001').asPortNumber();
exports.JWT_SECRET = e.get('JWT_SECRET').required().asString();
exports.TRUST_PROXY = e.get('TRUST_PROXY').required().asString();
exports.AUTHORIZATION_KEY = e
    .get('AUTHORIZATION_KEY')
    .required()
    .asString();
exports.BYPASS_AUTHORIZATION_ON_DEVELOPMENT = e
    .get('BYPASS_AUTHORIZATION_ON_DEVELOPMENT')
    .default('false')
    .asBool();
exports.ORGANIZATION_EMAIL_DOMAIN = e
    .get('ORGANIZATION_EMAIL_DOMAIN')
    .required()
    .asString();
exports.BYPASS_ORGANIZATION_EMAIL_FILTER_ON_DEVELOPMENT = e
    .get('BYPASS_ORGANIZATION_EMAIL_FILTER_ON_DEVELOPMENT')
    .default('false')
    .asBool();
exports.CLIENT_URL = e.get('CLIENT_URL').required().asUrlString();
exports.CORS_WHITELIST = e.get('CORS_WHITELIST').required().asArray(',');
exports.GOOGLE_CLIENT_ID = e.get('GOOGLE_CLIENT_ID').required().asString();
exports.DATABASE_URL = e.get('DATABASE_URL').required().asUrlString();
exports.GOOGLE_CLIENT_SECRET = e
    .get('GOOGLE_CLIENT_SECRET')
    .required()
    .asString();
exports.GOOGLE_REFRESH_TOKEN = e
    .get('GOOGLE_REFRESH_TOKEN')
    .required()
    .asString();
exports.GOOGLE_PLAYGROUND_URL = e
    .get('GOOGLE_PLAYGROUND_URL')
    .required()
    .asUrlString();
exports.GOOGLE_DRIVE_FOLDER_ID = e
    .get('GOOGLE_DRIVE_FOLDER_ID')
    .required()
    .asString();
exports.PASSPORT_GOOGLE_CALLBACK_URL = e
    .get('PASSPORT_GOOGLE_CALLBACK_URL')
    .required()
    .asString();
exports.SMTP_TRANSPORT_URL = e
    .get('SMTP_TRANSPORT_URL')
    .required()
    .asUrlObject();
