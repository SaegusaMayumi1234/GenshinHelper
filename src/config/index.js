import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    DISCORD_TOKEN: Joi.string(),
    MONGODB_URI: Joi.string()
      .uri({ scheme: ['mongodb', 'mongodb+srv'] })
      .required(),
    MONGODB_NAME: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`ENV validation error: ${error.message}`);
}

export default {
  NODE_ENV: envVars.NODE_ENV,
  DISCORD_TOKEN: envVars.DISCORD_TOKEN,
  MONGODB_URI: envVars.MONGODB_URI,
  MONGODB_NAME: envVars.MONGODB_NAME,
};
