import "dotenv/config";
import app from "./app";

const PORT = parseInt(process.env.PORT ?? "3001", 10);
const HOST = "0.0.0.0";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Link a Postgres service in Railway variables.");
  process.exit(1);
}

const server = app.listen(PORT, HOST, () => {
  console.log(`API server listening on ${HOST}:${PORT}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
