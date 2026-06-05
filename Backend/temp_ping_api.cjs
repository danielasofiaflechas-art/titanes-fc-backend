const http = require('http');

const data = JSON.stringify({ email: 'admin@titanesfc.com', password: 'TitanesFC!2026' });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log('status', res.statusCode);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});

req.on('error', (err) => {
  console.error('ERROR', err.message);
  console.error('ERROR CODE:', err.code || 'N/A');
  console.error('ERROR STACK:', err.stack || 'N/A');
});

req.write(data);
req.end();
