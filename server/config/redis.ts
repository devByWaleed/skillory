import { Redis } from "ioredis";
import "dotenv/config";
import dns from "dns/promises";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const IS_PROD = process.env.NODE_ENV === "production";

let redisInstance: Redis | null = null;
let isOffline = false;
let offlineUntil = 0; // retry after cooldown instead of staying offline forever

// Helper to check for active internet connection
const checkInternet = async (): Promise<boolean> => {
    try {
        // Quick DNS lookup to check outbound internet access
        await dns.lookup("google.com");
        return true;
    } catch {
        return false;
    }
};

const getRedisClient = (): Redis => {
    if (redisInstance) return redisInstance;

    redisInstance = new Redis(REDIS_URL, {
        lazyConnect: true, // Prevents automatic connection on instantiation
        retryStrategy: (times) => Math.min(times * 200, 2000), // never give up
        connectTimeout: 5000,
        maxRetriesPerRequest: 1, // Fails fast when offline so server routes don't hang
    });

    redisInstance.on("connect", () => console.log("✅ Redis Connected Successfully"));
    redisInstance.on("ready", () => { isOffline = false; });
    redisInstance.on("error", (error) => {
        if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
            console.warn("⚠️ Redis unavailable (Offline or unreachable). Operations will safe-bypass.");
            isOffline = true;
        }
    });

    return redisInstance;
};

// Safe wrapper for Redis operations when offline
const createOfflineSafeRedis = () => {
    const dummyTarget = {} as Redis;

    return new Proxy(dummyTarget, {
        get(_, prop: string) {
            // Intercept calls to testRedis or internal checks
            if (prop === "ping") {
                return async () => {
                    const hasInternet = await checkInternet();
                    if (!hasInternet || isOffline) return "OFFLINE_SKIPPED";
                    const client = getRedisClient();
                    if (client.status === "wait") await client.connect().catch(() => { });
                    return client.ping();
                };
            }

            return async (...args: any[]) => {
                if (isOffline && Date.now() < offlineUntil) {
                    if (IS_PROD) throw new Error("Redis is unavailable");
                    return null; // dev only: safe bypass
                }

                const client = getRedisClient();
                try {
                    if (client.status === "wait") {
                        await client.connect();
                    }
                    const method = (client as any)[prop];
                    if (typeof method === "function") {
                        return await method.apply(client, args);
                    }
                } catch (err: any) {
                    console.error(`❌ Redis operation '${prop}' failed: ${err.message}`);
                    isOffline = true;
                    offlineUntil = Date.now() + 30_000;
                    if (IS_PROD) throw err; // surface it instead of fake-succeeding
                    return null;
                }
            };
        },
    });
};

const redisProxy = createOfflineSafeRedis();

export const testRedis = async () => {
    try {
        const hasInternet = await checkInternet();
        if (!hasInternet) {
            console.warn("⚠️ No internet connection detected. Skipping Redis ping.");
            return false;
        }
        const pong = await redisProxy.ping();
        console.log("✅ Redis Ping:", pong);
        return pong === "PONG";
    } catch (error) {
        console.error("❌ Redis Ping failed:", error);
        return false;
    }
};

export { redisProxy as redis };
export default redisProxy;









// REDIS Configuration
/*
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
*/


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