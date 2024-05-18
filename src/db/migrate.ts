import { migrate } from "drizzle-orm/libsql/migrator";
import { db, client } from "./db";

async function main() {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: "./src/db/migrations" });

  // Don't forget to close the connection, otherwise the script will hang
  client.close();
}

main();
