import express from "express";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        service: "duodrive-backend",
    });
});

export default router;
