import "dotenv/config";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdimRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

const start = async () => {
  // Validate environment variables
  if (!process.env.MONGO_URI || !process.env.PORT) {
    console.error("MONGO_URI and PORT must be defined in the environment variables.");
    process.exit(1);
  }

  // Connect to the database
  try {
    await connectDB(process.env.MONGO_URI);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }

  const app = Fastify();

  app.register(fastifySocketIO, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });

  await registerRoutes(app);
  await buildAdimRouter(app);

  app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Blinkit Started On http://localhost:${PORT}${admin.options.rootPath}`);
    }
  });

  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("A User Connected ✅");

      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log(` 🔴 User Joined room ${orderId}`);
      });

      socket.on("disconnect", () => {
        console.log("User Disconnected ❌");
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error); // Log any socket errors
      });
    });
  });
};

start();
