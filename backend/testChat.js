const http = require('http');

const data = JSON.stringify({
  conversationId: "test1",
  message: "I am looking for a laptop for programming, my budget is around 60000"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});

req.on('error', e => console.error(`Problem with request: ${e.message}`));
req.write(data);
req.end();
