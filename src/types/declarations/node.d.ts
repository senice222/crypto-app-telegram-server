type Next = () => void | Promise<void>;

declare namespace NodeJS {
  interface ProcessEnv {
    BOT_TOKEN?: string;
    DATABASE_USER?: string;
    DATABASE_PASSWORD?: string;
    DATABASE_HOST?: string;
    DATABASE_PORT?: string;
    DATABASE_BASE?: string;
    CRYPTO_CLOUD_BASE_URL?: string;
    ADMIN_ID?: string;
    API_KEY?: string;
    SHOP_ID?: string;
    JWT_SECRET?: string;
    PORT?: string;
    WEB_APP_FRONTEND?: string;
  }
}
