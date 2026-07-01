/* eslint-disable prettier/prettier */
import { IsJWT, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsJWT()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
