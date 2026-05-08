import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseGlobal = typeof globalThis & {
  mongooseCache?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

const g = globalThis as MongooseGlobal;

const cache = g.mongooseCache ?? { conn: null, promise: null };
g.mongooseCache = cache;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
