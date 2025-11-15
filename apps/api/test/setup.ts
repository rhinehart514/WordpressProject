import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables
const envPath = resolve(__dirname, '../../../.env.test');
config({ path: envPath });

// Set test environment
process.env.NODE_ENV = 'test';

// Increase test timeout for integration tests
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
  // Any global setup can go here
  console.log('🧪 Test suite starting...');
});

afterAll(async () => {
  // Any global cleanup can go here
  console.log('✅ Test suite completed');
});
