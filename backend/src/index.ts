import 'dotenv/config';
import { createApp } from "./app.js";
import { logger } from "./utils/logger.js";

const main = async (): Promise<void> => {
    try {
        const app = createApp();
    
        const port = process.env.PORT || 8080;
        app.listen(port, () => {
            logger.info(`server is running on port ${port}`);
        });
    
        const shutdown = (): void => {
            logger.info('shutting down server...');
            Promise.all([])
                .catch((error: unknown) => {
                    logger.error({ error }, "error during shutdown")
                })
                .finally(() => {
                    logger.info("Auth service has been shut down")
                    process.exit(0)
                })
        }
    
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (error) {
        logger.error({ error }, "error starting server");
        process.exit(1);
    }
}

main();