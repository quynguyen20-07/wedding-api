import mongoose from 'mongoose';
// src/app-simple.ts
import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wedding_platform');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
app.get('/', (_req, res) => { // Thêm _ trước req
  res.json({ 
    message: 'Welcome to Wedding Management API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (_req, res) => { // Thêm _ trước req
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling
app.use('*', (_req, res) => { // Thêm _ trước req
  res.status(404).json({ error: 'Not Found' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;