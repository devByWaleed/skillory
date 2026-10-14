import { Redis } from "ioredis";
import "dotenv/config";
import dns from "dns/promises";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const IS_PROD = process.env.NODE_ENV === "production";

// How long we skip redis after a failure, so requests don't keep waiting on a dead connection
const OFFLINE_COOLDOWN_MS = 30 * 1000;

// How often we allow the same "redis is down" warning to print, so the console stays readable
const WARN_EVERY_MS = 15 * 1000;

let redisInstance: Redis | null = null;
let isOffline = false;
let offlineUntil = 0;
let lastWarnAt = 0;

// Remember that redis is down and pause calls to it for a while
const markOffline = () => {
    isOffline = true;
    offlineUntil = Date.now() + OFFLINE_COOLDOWN_MS;
};

// True while we are inside the cooldown window after a failure
const shouldSkipRedis = () => isOffline && Date.now() < offlineUntil;

// Quick check for outbound internet access
const checkInternet = async (): Promise<boolean> => {
    try {
        await dns.lookup("google.com");
        return true;
    } catch {
        return false;
    }
};

const getRedisClient = (): Redis => {
    if (redisInstance) return redisInstance;

    redisInstance = new Redis(REDIS_URL, {
        lazyConnect: true, // do not connect until the first command needs it
        retryStrategy: (times) => Math.min(times * 200, 2000), // keep retrying in the background
        connectTimeout: 5000,
        maxRetriesPerRequest: 1, // fail fast when offline so routes never hang
    });

    redisInstance.on("connect", () => console.log("✅ Redis Connected Successfully"));

    redisInstance.on("ready", () => {
        isOffline = false;
        offlineUntil = 0;
    });

    // Without this listener a connection error could take the whole process down
    redisInstance.on("error", (error: Error) => {
        const code = (error as Error & { code?: string }).code;

        if (code === "ENOTFOUND" || code === "ECONNREFUSED" || code === "ETIMEDOUT") {
            markOffline();

            // Print the warning now and then, not on every retry
            if (Date.now() - lastWarnAt > WARN_EVERY_MS) {
                lastWarnAt = Date.now();
                console.warn("⚠️ Redis unavailable (offline or unreachable). Operations will safe-bypass.");
            }
        }
    });

    return redisInstance;
};

// Wrapper that lets the app keep running when redis cannot be reached
const createOfflineSafeRedis = () => {
    const dummyTarget = {} as Redis;

    return new Proxy(dummyTarget, {
        get(_, prop: string | symbol) {
            // Ignore symbols and "then" so awaiting the proxy itself never hangs
            if (typeof prop !== "string" || prop === "then") return undefined;

            if (prop === "ping") {
                return async () => {
                    const hasInternet = await checkInternet();
                    if (!hasInternet || shouldSkipRedis()) return "OFFLINE_SKIPPED";

                    const client = getRedisClient();
                    if (client.status === "wait") await client.connect().catch(() => { });
                    return client.ping();
                };
            }

            return async (...args: any[]) => {
                // Inside the cooldown: skip redis completely
                if (shouldSkipRedis()) {
                    if (IS_PROD) throw new Error("Redis is unavailable");
                    return null; // local dev only: act like a cache miss
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
                    markOffline();

                    if (IS_PROD) throw err; // in production, show the real failure
                    return null; // locally, keep the server and routes alive
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