import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

import dotenv = require('dotenv');
dotenv.config();

// note:  to make sure all env variables are validated
class Configuration {
  @IsBoolean()
  readonly DATABASE_LOGGING = process.env.DATABASE_LOGGING === 'true';

  @IsString()
  readonly DATABASE_HOST = process.env.DATABASE_HOST as string;

  @IsInt()
  readonly DATABASE_PORT = Number(process.env.DATABASE_PORT);

  @IsString()
  readonly DATABASE_NAME = process.env.DATABASE_NAME as string;

  @IsString()
  readonly DATABASE_USER = process.env.DATABASE_USER as string;

  @IsString()
  readonly DATABASE_PASSWORD = process.env.DATABASE_PASSWORD as string;

  @IsString()
  readonly SLACK_TOKEN = process.env.DATABASE_PASSWORD as string;

  @IsString()
  readonly JWT_SECRET = process.env.JWT_SECRET;

  @IsNumber()
  readonly JWT_EXPIRATION = +process.env.JWT_EXPIRATION;

  @IsBoolean()
  readonly DATABASE_SYNC = process.env.DATABASE_SYNC === 'true';

  @IsInt()
  readonly PORT = Number(process.env.PORT);

  isProduction = process.env.IS_PRODUCTION === 'true';
  isStaginig = process.env.IS_STAGING === 'true';

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    console.error(`Config validation error: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

export const Config = new Configuration();
