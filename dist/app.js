"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const graphql_playground_html_1 = require("graphql-playground-html");
const apollo_server_express_1 = require("apollo-server-express");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const fs_1 = require("fs");
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const resolvers_1 = require("./graphql/resolvers");
const swagger_json_1 = __importDefault(require("./swagger.json"));
dotenv_1.default.config();
class WeddingApp {
    constructor() {
        this.initPromise = null;
        // Handler cho Vercel (serverless)
        this.handler = (req, res) => {
            this.initPromise.then(() => {
                this.app(req, res);
            }).catch((err) => {
                console.error("Initialization error:", err);
                res.status(500).send("Server initialization error");
            });
        };
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || "5000");
        this.httpServer = http_1.default.createServer(this.app);
        this.initializeMiddleware();
        this.initPromise = this.initializeAsync();
    }
    initializeMiddleware() {
        this.app.use((0, helmet_1.default)({
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
                    connectSrc: ["'self'", "https://cdn.jsdelivr.net", "ws:"],
                    fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
                },
            },
            crossOriginEmbedderPolicy: false,
        }));
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN?.split(",") || "*",
            credentials: true,
        }));
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 100,
        });
        this.app.use("/graphql", limiter);
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Static files
        this.app.use("/uploads", express_1.default.static("uploads"));
    }
    async initializeAsync() {
        await this.initializeDatabase();
        await this.initializeGraphQL();
        this.initializeRoutes();
    }
    async initializeGraphQL() {
        try {
            const typeDefs = (0, fs_1.readFileSync)(path_1.default.join(__dirname, "graphql/schema.graphql"), "utf-8");
            const server = new apollo_server_express_1.ApolloServer({
                typeDefs,
                resolvers: resolvers_1.resolvers,
                context: ({ req }) => {
                    const token = req.headers.authorization?.replace("Bearer ", "") || "";
                    return { token, req };
                },
                formatError: (error) => {
                    const statusCode = error.extensions.exception?.statusCode;
                    const err = {
                        message: error.message,
                        code: statusCode,
                    };
                    console.error("GraphQL Error:", err);
                    return err;
                },
                introspection: true,
                cache: process.env.NODE_ENV === "production" ? "bounded" : undefined,
            });
            await server.start();
            server.applyMiddleware({
                app: this.app,
                path: "/graphql",
                cors: false,
            });
            console.log("✅ GraphQL server ready at /graphql");
        }
        catch (error) {
            console.error("❌ GraphQL initialization error:", error);
            throw error;
        }
    }
    initializeRoutes() {
        // Swagger UI
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, (req, res, next) => {
            res.setHeader("Content-Security-Policy", "default-src 'self' https: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data:; font-src 'self' https: data:");
            next();
        }, swagger_ui_express_1.default.setup(swagger_json_1.default, {
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
        }));
        // GraphQL Playground
        this.app.get("/playground", (_req, res) => {
            res.setHeader("Content-Type", "text/html");
            const playground = (0, graphql_playground_html_1.renderPlaygroundPage)({
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
                database: mongoose_1.default.connection.readyState === 1 ? "connected" : "disconnected",
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
            const testHtmlPath = path_1.default.join(__dirname, "./templates/graphql-quick-start-interface.html");
            try {
                const htmlContent = (0, fs_1.readFileSync)(testHtmlPath, "utf-8");
                res.send(htmlContent);
            }
            catch (error) {
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
    async initializeDatabase() {
        try {
            const mongoURI = process.env.MONGODB_URI;
            if (!mongoURI) {
                throw new Error("MONGODB_URI is not defined");
            }
            await mongoose_1.default.connect(mongoURI);
            console.log("✅ MongoDB connected successfully");
        }
        catch (error) {
            console.error("❌ MongoDB connection error:", error);
            throw error;
        }
    }
    async start() {
        await this.initPromise;
        this.httpServer.listen(this.port, () => {
            console.log("\n" + "=".repeat(60));
            console.log("🎉 WEDDING MANAGEMENT API STARTED SUCCESSFULLY");
            console.log("=".repeat(60));
            console.log(`🚀 Server URL: http://localhost:${this.port}`);
            console.log(`📊 GraphQL Endpoint: http://localhost:${this.port}/graphql`);
            console.log(`🎮 GraphQL Playground: http://localhost:${this.port}/playground`);
            console.log(`🧪 Test Interface: http://localhost:${this.port}/test`);
            console.log(`🏥 Health Check: http://localhost:${this.port}/health`);
            console.log(`📖 API Documentation: http://localhost:${this.port}/api-docs`);
            console.log(`📁 Uploads: http://localhost:${this.port}/uploads`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
        });
    }
}
const weddingApp = new WeddingApp();
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    weddingApp.start().catch(console.error);
}
exports.default = weddingApp.handler;
//# sourceMappingURL=app.js.map