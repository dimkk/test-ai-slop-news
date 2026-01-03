import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Connected to Redis');
  }
}

export async function disconnectRedis() {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
    console.log('Disconnected from Redis');
  }
}

// Cache helpers
export const cache = {
  get: async (key: string): Promise<string | null> => {
    await connectRedis();
    return await redisClient.get(key);
  },

  set: async (key: string, value: string, ttl?: number): Promise<void> => {
    await connectRedis();
    if (ttl) {
      await redisClient.setEx(key, ttl, value);
    } else {
      await redisClient.set(key, value);
    }
  },

  del: async (key: string): Promise<void> => {
    await connectRedis();
    await redisClient.del(key);
  },

  exists: async (key: string): Promise<boolean> => {
    await connectRedis();
    const result = await redisClient.exists(key);
    return result === 1;
  },

  // Cache article lists
  cacheArticles: async (page: number, limit: number, data: any): Promise<void> => {
    const key = `articles:page:${page}:limit:${limit}`;
    await cache.set(key, JSON.stringify(data), 300); // 5 minutes TTL
  },

  getCachedArticles: async (page: number, limit: number): Promise<any | null> => {
    const key = `articles:page:${page}:limit:${limit}`;
    const cached = await cache.get(key);
    return cached ? JSON.parse(cached) : null;
  },

  // Cache single articles
  cacheArticle: async (id: string, data: any): Promise<void> => {
    const key = `article:${id}`;
    await cache.set(key, JSON.stringify(data), 600); // 10 minutes TTL
  },

  getCachedArticle: async (id: string): Promise<any | null> => {
    const key = `article:${id}`;
    const cached = await cache.get(key);
    return cached ? JSON.parse(cached) : null;
  },

  // Cache search results
  cacheSearch: async (query: string, page: number, limit: number, data: any): Promise<void> => {
    const key = `search:${encodeURIComponent(query)}:page:${page}:limit:${limit}`;
    await cache.set(key, JSON.stringify(data), 180); // 3 minutes TTL
  },

  getCachedSearch: async (query: string, page: number, limit: number): Promise<any | null> => {
    const key = `search:${encodeURIComponent(query)}:page:${page}:limit:${limit}`;
    const cached = await cache.get(key);
    return cached ? JSON.parse(cached) : null;
  },

  // Invalidate cache
  invalidateArticlesCache: async (): Promise<void> => {
    await connectRedis();
    const keys = await redisClient.keys('articles:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  },

  invalidateSearchCache: async (): Promise<void> => {
    await connectRedis();
    const keys = await redisClient.keys('search:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  },
};

export default redisClient;