import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  // @Min(20000)
  // @Max(29999)
  APP_PORT: number;
}

export function envValidate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  // console.debug(validatedConfig);

  // console.debug(errors.map(e => `${e.property}: ${e.value}`));

  if (errors.length > 0) {
    throw new Error(errors.map((e) => `${e.property}: ${e.value}`).join('\n'));
  }
  return validatedConfig;
}
