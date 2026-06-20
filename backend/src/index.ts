import "dotenv/config";
import app from "./app";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
