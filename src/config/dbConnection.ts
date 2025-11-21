import mongoose from 'mongoose';
const uri = process.env.DB_CONNECTION || 'mongodb://localhost:27017/Magic';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    // Type guard to check if error is an instance of Error
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    // In serverless / production environments exiting the process
    // can crash the runtime and obscure the original error digest.
    // Throw the error so Next/Vercel logging surfaces the stack and digest.
    throw error;
  }
};
