import { plainToClass } from 'class-transformer';
import { IsDefined, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsDefined()
  @IsString({ message: 'INVALID PORT' })
  PORT: string;

  @IsDefined()
  @IsString({ message: 'INVALID MONGODB URL' })
  MONGODB_URL: string;

  @IsDefined()
  @IsString({ message: 'INVALID JWT' })
  JWT_SECRET: string;

  @IsDefined()
  @IsString()
  JWT_ACCESS_TOKEN_EXPIRES_IN: string;

  @IsDefined()
  @IsString()
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
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
