import { Sequelize } from "sequelize";
import { logger } from "@config/app.config";
import { setupServer } from "@/server";

const {
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_BASE,
} = process.env;

if (
  !DATABASE_USER ||
  !DATABASE_PASSWORD ||
  !DATABASE_HOST ||
  !DATABASE_PORT ||
  !DATABASE_BASE
) {
  logger.error(
    "One or more environment variables are missing for database connection",
    { isThrow: true, logToFile: true }
  );
}

const connectionString = `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_BASE}`;

const db = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false,
});

db.authenticate()
  .then(() => {
    console.log("Database connected successfully.");
    return db.sync({ alter: true });
  })
  .then(async () => {
    console.log("Database synced successfully.");
  })
  .catch((error: Error) => {
    console.error("Unable to connect to the database:", error);
  });

export default db;
