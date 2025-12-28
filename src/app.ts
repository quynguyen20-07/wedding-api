import { renderPlaygroundPage } from "graphql-playground-html";
import { ApolloServer } from "apollo-server-express";
import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";
import { readFileSync } from "fs";
import mongoose from "mongoose";
import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import cors from "cors";

import { resolvers } from "./graphql/resolvers";
import swaggerDocument from "./swagger.json";

dotenv.config();

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
    // Cấu hình Helmet với CSP cho phép GraphQL Playground
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: [
              "'self'",
              "'unsafe-inline'",
              "'unsafe-eval'",
              "https://cdn.jsdelivr.net",
            ],
            imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
            connectSrc: [
              "'self'",
              "https://cdn.jsdelivr.net",
              "ws://localhost:" + this.port,
            ],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
          },
        },
        crossOriginEmbedderPolicy: false,
      })
    );

    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "*",
        credentials: true,
      })
    );

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
      const typeDefs = readFileSync(
        path.join(__dirname, "graphql/schema.graphql"),
        "utf-8"
      );

      const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
          const token = req.headers.authorization?.replace("Bearer ", "") || "";
          return { token, req };
        },
        formatError: (error) => {
          console.error("GraphQL Error:", error.message);
          return {
            message: error.message,
            code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
          };
        },
        introspection: true,
      });

      await server.start();
      server.applyMiddleware({
        app: this.app,
        path: "/graphql",
        cors: false,
      });

      console.log("✅ GraphQL server ready at /graphql");
    } catch (error) {
      console.error("❌ GraphQL initialization error:", error);
    }
  }

  private initializeRoutes(): void {
    // Swagger UI
    this.app.use(
      "/api-docs",
      swaggerUi.serve as any,
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.setHeader(
          "Content-Security-Policy",
          "default-src 'self' https: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data:; font-src 'self' https: data:"
        );
        next();
      },
      swaggerUi.setup(swaggerDocument, {
        customCss: `
          .swagger-ui .topbar { display: none }
          .swagger-ui .information-container { display: none }
        `,
        customSiteTitle: "Wedding API Documentation",
        swaggerOptions: {
          docExpansion: "list",
          filter: true,
          displayRequestDuration: true,
        },
      }) as any
    );

    // GraphQL Playground
    this.app.get("/playground", (_req, res) => {
      res.setHeader("Content-Type", "text/html");
      const playground = renderPlaygroundPage({
        endpoint: "/graphql",
        settings: {
          "editor.theme": "dark",
          "general.betaUpdates": false,
          "editor.reuseHeaders": true,
          "tracing.hideTracingResponse": true,
          "editor.fontSize": 14,
          "editor.fontFamily": `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
        },
      });
      res.write(playground);
      res.end();
    });

    // Health check
    this.app.get("/health", (_req, res) => {
      res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        database:
          mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        environment: process.env.NODE_ENV,
        endpoints: {
          graphql: "/graphql",
          playground: "/playground",
          docs: "/api-docs",
          health: "/health",
        },
        version: "1.0.0",
      });
    });

    // API info
    this.app.get("/", (_req, res) => {
      res.json({
        name: "Wedding Management API",
        version: "1.0.0",
        description: "Complete wedding management platform with GraphQL API",
        documentation: "https://github.com/quynguyen20-07/wedding-api",
        endpoints: {
          home: "/",
          health: "/health",
          graphql: "/graphql",
          playground: "/playground",
          docs: "/api-docs",
          uploads: "/uploads",
        },
        features: [
          "User Authentication & Authorization",
          "Wedding Management",
          "Guest RSVP System",
          "Bank Account Integration",
          "Wish/Congratulation Messages",
          "Wedding Timeline & Events",
          "Love Story Timeline",
        ],
        quickStart: {
          registerUser: `mutation { register(email: "test@example.com", password: "password123", fullName: "Test User") { user { id email } } }`,
          createWedding: `mutation { createWedding(title: "My Wedding", slug: "my-wedding") { id title slug } }`,
          testQuery: `query { hello }`,
        },
      });
    });

    this.app.get("/test", (_req, res) => {
      const testHtmlPath = path.join(
        __dirname,
        "./templates/graphql-quick-start-interface.html"
      );

      try {
        const htmlContent = readFileSync(testHtmlPath, "utf-8");
        res.send(htmlContent);
      } catch (error) {
        res.status(500).json({
          error: "Test interface not available",
          message: "Could not load test interface HTML file",
        });
      }
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        available_endpoints: [
          { method: "GET", path: "/", description: "API Information" },
          { method: "GET", path: "/health", description: "Health Check" },
          { method: "GET", path: "/test", description: "Test Interface" },
          {
            method: "GET",
            path: "/playground",
            description: "GraphQL Playground",
          },
          {
            method: "GET",
            path: "/api-docs",
            description: "API Documentation",
          },
          { method: "POST", path: "/graphql", description: "GraphQL Endpoint" },
          { method: "GET", path: "/uploads/*", description: "Static Files" },
        ],
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

      const connection = mongoose.connection;
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
      console.log("\n" + "=".repeat(60));
      console.log("🎉 WEDDING MANAGEMENT API STARTED SUCCESSFULLY");
      console.log("=".repeat(60));
      console.log(`🚀 Server URL: http://localhost:${this.port}`);
      console.log(`📊 GraphQL Endpoint: http://localhost:${this.port}/graphql`);
      console.log(
        `🎮 GraphQL Playground: http://localhost:${this.port}/playground`
      );
      console.log(`🧪 Test Interface: http://localhost:${this.port}/test`);
      console.log(`🏥 Health Check: http://localhost:${this.port}/health`);
      console.log(
        `📖 API Documentation: http://localhost:${this.port}/api-docs`
      );
      console.log(`📁 Uploads: http://localhost:${this.port}/uploads`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  }
}

const weddingApp = new WeddingApp();
weddingApp.start().catch(console.error);

export default weddingApp;
