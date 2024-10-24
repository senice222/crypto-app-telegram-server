import dotenv from "dotenv";
dotenv.config();

import { setupServer } from "./server";
import "@bot/bot";
import "@database/config/database.config";

setupServer();
