const mongoose = require('mongoose');

// Setup test database
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ayursutra_test';
  await mongoose.connect(mongoUri);
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
