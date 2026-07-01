/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  username?: string;
}
