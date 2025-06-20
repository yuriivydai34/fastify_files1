import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { build } from "./app";
import { createContext } from "./routes/context";
import { env } from "./config/env";
import { config } from "./config/config";
import { appRouter } from "./routes";
import { initializeKafka } from "./services/kafka";
import { startConsumer, stopConsumer } from "./services/kafka-consumer";

const app = build({
  logger: config[env.NODE_ENV].logger,
});

// Initialize Kafka and start consumer
Promise.all([
  initializeKafka(),
  startConsumer()
]).catch((error) => {
  console.error('Failed to initialize Kafka:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM signal, shutting down...');
  await stopConsumer();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT signal, shutting down...');
  await stopConsumer();
  process.exit(0);
});

app.register(fastifyTRPCPlugin, {
  prefix: "/api",
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

app.register(cors, {
  origin: "*",
  credentials: true,
});

app.register(helmet);

if (env.HOST) {
  app.listen(
    {
      port: env.PORT,
      host: env.HOST,
    },
    (err, _address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
    }
  );
} else {
  app.listen(
    {
      port: env.PORT,
    },
    (err, _address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
    }
  );
}
