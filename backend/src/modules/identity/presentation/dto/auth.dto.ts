import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class RefreshTokenDto {
  @IsString()
  @MinLength(10)
  refreshToken!: string;
}

export class LogoutDto {
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
