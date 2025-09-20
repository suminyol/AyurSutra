const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AyurSutra Development Environment...\n');

// Start backend server
console.log('📡 Starting Backend Server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Start frontend server
console.log('🎨 Starting Frontend Server...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..', 'ayursutra-frontend'),
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

// Handle errors
backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err);
});

console.log('✅ Development environment started successfully!');
console.log('📡 Backend: http://localhost:3000');
console.log('🎨 Frontend: http://localhost:5173');
console.log('📚 API Docs: http://localhost:3000/api-docs');
console.log('\nPress Ctrl+C to stop both servers');
