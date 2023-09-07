declare namespace NodeJS {
    interface ProcessEnv {
      // Add your environment variables  here
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;

    MYSQL_DB_NAME: string,
    MYSQL_DB_USERNAME: string,
    MYSQL_DB_PASSWORD: string

    MONGO_URL: string

      EMAIL_USERNAME: string
      EMAIL_PASSWORD: string
      EMAIL_FROM: string

      
      JWT_SECRET_KEY: string
      JWT_COOKIE_EXPIRES_IN: number
      EXPIRES_IN: number
      JWT_PAYLOAD: string

    }
  }