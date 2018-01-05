import * as dotenv from "dotenv"

const path = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env"

dotenv.config({ path })

export default {
  env: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  host: process.env.APP_HOST,
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  salt_password: process.env.SALT_PASSWORD,

  isEnvDev: process.env.NODE_ENV == "development",
  isEnvTest: process.env.NODE_ENV == "test",
  isEnvProd: process.env.NODE_ENV == "production",


}
