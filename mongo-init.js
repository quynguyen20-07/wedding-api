// mongo-init.js
db = db.getSiblingDB('wedding_platform');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.weddings.createIndex({ slug: 1 }, { unique: true });
db.weddings.createIndex({ userId: 1 });
db.guests.createIndex({ weddingId: 1 });
db.guests.createIndex({ email: 1 });

// Create admin user
db.users.insertOne({
  email: 'admin@wedding.com',
  password: '$2a$10$YourHashedPasswordHere', // Hash of 'admin123'
  fullName: 'Administrator',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});