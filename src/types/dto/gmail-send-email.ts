import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString
} from 'class-validator'
import { SendMailOptions } from 'nodemailer'

export class GmailSendEmail implements SendMailOptions {
  @IsOptional()
  @IsString()
  from: string

  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  to: string[]

  @IsOptional()
  @IsString()
  html: string

  @IsOptional()
  @IsString()
  text: string

  @IsOptional()
  @IsString()
  subject: string
}
