import { Injectable } from '@nestjs/common';
import { Env, parseEnv } from 'atenv';
import { plainToClass } from 'class-transformer';
import { IsDefined, IsString, validateSync } from 'class-validator';

@Injectable()
export class ConfigService {
  @Env('PORT')
  @IsDefined()
  @IsString({ message: 'INVALID PORT' })
  PORT: string;

  @IsDefined()
  @Env('MONGODB_URL')
  @IsString({ message: 'INVALID MONGODB URL' })
  MONGODB_URL: string;

  @IsDefined()
  @Env('JWT_SECRET')
  @IsString({ message: 'INVALID JWT' })
  JWT_SECRET: string;

  @IsDefined()
  @IsString()
  @Env('JWT_ACCESS_TOKEN_EXPIRES_IN')
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;

  @IsDefined()
  @IsString()
  @Env('JWT_REFRESH_TOKEN_EXPIRES_IN')
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;
}

export const ParsedConfigs = parseEnv(ConfigService);

export const validate = (config: any) => {
  const validatedConfig = plainToClass(ConfigService, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
