"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const apollo_server_express_1 = require("apollo-server-express");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const fs_1 = require("fs");
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./middleware/logger");
const resolvers_1 = require("./graphql/resolvers");
dotenv_1.default.config();
class WeddingApp {
    app;
    port;
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || "5000");
        // Gọi các init sync trước
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    // Làm async để await database và GraphQL
    async init() {
        await this.initializeDatabase();
        await this.initializeGraphQL();
    }
    async initializeDatabase() {
        try {
            const mongoURI = process.env.MONGODB_URI;
            if (!mongoURI) {
                throw new Error("MONGODB_URI is not defined in environment variables");
            }
            await mongoose_1.default.connect(mongoURI);
            console.log("✅ MongoDB connected successfully to Atlas cluster");
        }
        catch (error) {
            console.error("❌ MongoDB connection error:", error);
            process.exit(1);
        }
    }
    initializeMiddleware() {
        // Security headers
        this.app.use((0, helmet_1.default)());
        // CORS
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN?.split(",") || [
                "http://localhost:8080",
                "http://localhost:3000",
            ],
            credentials: true,
        }));
        // Rate limiting
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
            max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
            message: "Too many requests from this IP, please try again later.",
        });
        this.app.use("/graphql", limiter);
        // Body parsing
        this.app.use(express_1.default.json({ limit: process.env.MAX_FILE_SIZE || "5mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Logging
        this.app.use(logger_1.requestLogger);
        // Static files
        this.app.use("/uploads", express_1.default.static("uploads"));
    }
    async initializeGraphQL() {
        try {
            const typeDefs = (0, fs_1.readFileSync)(path_1.default.join(__dirname, "graphql/schema.graphql"), "utf-8");
            const server = new apollo_server_express_1.ApolloServer({
                typeDefs,
                resolvers: resolvers_1.resolvers,
                context: ({ req }) => {
                    const token = req.headers.authorization?.replace("Bearer ", "");
                    return { token, req };
                },
                formatError: (error) => {
                    console.error("GraphQL Error:", error.message);
                    return {
                        message: error.message,
                        code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
                    };
                },
                plugins: process.env.NODE_ENV === "production"
                    ? []
                    : [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
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
        }
    }
    initializeRoutes() {
        // Swagger docs
        const swaggerDocument = require(path_1.default.join(__dirname, "swagger.json")); // <-- Load swagger.json
        this.app.use("/api", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
        // Health check
        this.app.get("/health", (_req, res) => {
            res.json({
                status: "OK",
                timestamp: new Date().toISOString(),
                database: mongoose_1.default.connection.readyState === 1 ? "connected" : "disconnected",
                environment: process.env.NODE_ENV,
                version: "1.0.0",
            });
        });
        // API info
        this.app.get("/api/v1", (_req, res) => {
            res.json({
                name: "Wedding Management API",
                version: "1.0.0",
                graphql: "/graphql",
                docs: "/api-docs",
            });
        });
        // 404 handler
        this.app.use("*", (_req, res) => {
            res.status(404).json({
                error: "Not Found",
                message: `Cannot ${_req.method} ${_req.originalUrl}`,
            });
        });
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.errorHandler);
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Server running on port ${this.port}`);
            console.log(`📊 GraphQL endpoint: http://localhost:${this.port}/graphql`);
            console.log(`🏥 Health check: http://localhost:${this.port}/health`);
            console.log(`📖 Swagger docs: http://localhost:${this.port}/api-docs`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
            console.log(`🗄️  Database: ${mongoose_1.default.connection.host || "not connected yet"}`); // <-- Fix log undefined
            // Log endpoints like NestJS
            const endpoints = (0, express_list_endpoints_1.default)(this.app);
            endpoints.forEach((endpoint) => {
                endpoint.methods.forEach((method) => {
                    console.log(`[LOG] ${method} ${endpoint.path} - ${new Date().toISOString()}`);
                });
            });
        });
    }
    getApp() {
        return this.app;
    }
}
// Start the application
(async () => {
    const weddingApp = new WeddingApp();
    await weddingApp.init(); // <-- Await init async
    weddingApp.start();
})();
exports.default = new WeddingApp().getApp(); // Giữ export, nhưng có thể không dùng nếu file là entry point
//# sourceMappingURL=app.js.map