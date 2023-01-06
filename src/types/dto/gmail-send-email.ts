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
  readonly from: string

  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  readonly to: string[]

  @IsOptional()
  @IsString()
  readonly html: string

  @IsOptional()
  @IsString()
  readonly text: string

  @IsOptional()
  @IsString()
  readonly subject: string
}
