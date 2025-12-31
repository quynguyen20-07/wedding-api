declare class WeddingApp {
    private app;
    private port;
    private httpServer;
    constructor();
    private initializeMiddleware;
    private initializeGraphQL;
    private initializeRoutes;
    private initializeDatabase;
    start(): Promise<void>;
}
declare const weddingApp: WeddingApp;
export default weddingApp;
//# sourceMappingURL=app.d.ts.map