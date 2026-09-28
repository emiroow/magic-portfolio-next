import mongoose from 'mongoose';

/**
 * Cached MongoDB connection.
 * Reuses an existing connection across hot reloads and serverless invocations.
 * Throws a descriptive error when `MONGODB_URI` is missing or the connection fails.
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Add it to .env.local (see .env.example).');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * Best-effort connection used by server components and public APIs.
 * Returns `false` (instead of throwing) when the database is not
 * configured or unreachable, so pages can render graceful empty states.
 */
export async function tryConnectDB(): Promise<boolean> {
  if (!process.env.MONGODB_URI) return false;
  try {
    await connectDB();
    return true;
  } catch (error) {
    console.error('[db] connection failed:', error instanceof Error ? error.message : error);
    return false;
  }
}
