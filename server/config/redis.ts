import { Redis } from "ioredis";
import "dotenv/config";

// Get Redis URL from environment
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Create Redis client
const redis = new Redis(REDIS_URL, {
    // Retry strategy
    retryStrategy: (times) => {
        if (times > 5) {
            console.error(`❌ Redis: Failed to connect after ${times} attempts`);
            return null; // Stop retrying
        }
        const delay = Math.min(times * 100, 3000);
        console.log(`🔄 Redis: Retry ${times} in ${delay}ms`);
        return delay;
    },
    // Connection timeout
    connectTimeout: 10000,
    // Keep alive
    keepAlive: 30000,
});

// Connection events
redis.on("connect", () => {
    console.log("✅ Redis Connected Successfully");
});

redis.on("ready", () => {
    console.log("✅ Redis Ready");
});

redis.on("error", (error) => {
    if (error.code === "ECONNREFUSED") {
        console.error("❌ Redis: Connection refused. Is Redis running?");
    } else {
        console.error("❌ Redis Error:", error.message);
    }
});

redis.on("close", () => {
    console.log("⚠️ Redis: Connection closed");
});

redis.on("reconnecting", () => {
    console.log("🔄 Redis: Reconnecting...");
});

// Test function
export const testRedis = async () => {
    try {
        const pong = await redis.ping();
        console.log("✅ Redis Ping:", pong);
        return true;
    } catch (error) {
        console.error("❌ Redis Ping failed:", error);
        return false;
    }
};

// Export
export { redis };
export default redis;



/*
import { Redis } from "ioredis";
// Dotenv configuration
import "dotenv/config";


const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("Redis Connected");
    } else {
        throw new Error("Redis Connection Failed!");
    }
}

export const redis = new Redis(redisClient());
*/