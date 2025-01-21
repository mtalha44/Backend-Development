const http = require('node:http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-store'); 

  if (req.url === '/') {
    res.statusCode = 200;
    res.end('<h1>This is my home page</h1>');
    console.log(`Request URL: ${req.url}, Status Code: ${res.statusCode}`);
  } else if (req.url === '/about') {
    res.statusCode = 200;
    res.end('<h1>This is about page</h1>');
    console.log(`Request URL: ${req.url}, Status Code: ${res.statusCode}`);
  }
  else if( req.url === '/contact') {
    res.statusCode = 200;
const fs = require('fs');
const data = fs.readFileSync( 'index.html')
    res.end(data.toString());
    console.log(`Request URL: ${req.url}, Status Code: ${res.statusCode}`);
  }
  else {
    res.statusCode = 404;
    res.end('<h1>Page not found</h1>');
    console.log(`Request URL: ${req.url}, Status Code: ${res.statusCode}`);
  }
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
