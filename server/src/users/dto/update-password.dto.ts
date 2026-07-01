/* eslint-disable prettier/prettier */
import { IsEmail, IsJWT, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsMongoId()
  @IsOptional()
  id?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @IsJWT()
  @IsNotEmpty()
  code: string;
}
