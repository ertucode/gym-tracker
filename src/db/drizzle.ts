import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { exercises } from "./schema";

const client = createClient({
  url: "DATABASE_URL",
  authToken: "DATABASE_AUTH_TOKEN",
});

const db = drizzle(client);

const result = await db.select().from(exercises).all();
