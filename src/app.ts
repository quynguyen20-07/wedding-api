import { ApolloServer } from "apollo-server-express";
import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";

import swaggerDocument from "./swagger.json";

dotenv.config();

const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },
};

class WeddingApp {
  private app: express.Application;
  private port: number;
  private httpServer: http.Server;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "5000");
    this.httpServer = http.createServer(this.app);
  }

  private initializeMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    });
    this.app.use("/graphql", limiter);

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Static files
    this.app.use("/uploads", express.static("uploads"));
  }

  private async initializeGraphQL(): Promise<void> {
    try {
      const typeDefs = `
        type Query {
          hello: String
        }
      `;

      const server = new ApolloServer({
        typeDefs,
        resolvers,
      });

      await server.start();
      server.applyMiddleware({
        app: this.app,
        path: "/graphql",
      });

      console.log("✅ GraphQL server ready at /graphql");
    } catch (error) {
      console.error("❌ GraphQL initialization error:", error);
    }
  }

  private initializeRoutes(): void {
    this.app.use(
      "/api-docs",
      swaggerUi.serve as any,
      swaggerUi.setup(swaggerDocument) as any
    );

    this.app.get("/health", (_req, res) => {
      res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        database:
          mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        environment: process.env.NODE_ENV,
      });
    });

    this.app.get("/", (_req, res) => {
      res.json({
        name: "Wedding Management API",
        version: "1.0.0",
        graphql: "/graphql",
        health: "/health",
      });
    });

    this.app.use((req, res) => {
      res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
      });
    });
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const mongoURI = process.env.MONGODB_URI;
      if (!mongoURI) {
        throw new Error("MONGODB_URI is not defined");
      }
      await mongoose.connect(mongoURI);
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    }
  }

  public async start(): Promise<void> {
    this.initializeMiddleware();
    await this.initializeDatabase();
    await this.initializeGraphQL();
    this.initializeRoutes();

    this.httpServer.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📊 GraphQL: http://localhost:${this.port}/graphql`);
      console.log(`🏥 Health: http://localhost:${this.port}/health`);
      console.log(`📖 Swagger docs: http://localhost:${this.port}/api-docs`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(
        `🗄️  Database: ${mongoose.connection.host || "not connected yet"}`
      );
    });
  }
}

const weddingApp = new WeddingApp();
weddingApp.start().catch(console.error);
