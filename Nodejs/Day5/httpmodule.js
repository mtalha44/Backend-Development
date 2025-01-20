const http = require('node:http');

const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  console.log(req.url) 
  res.statusCode = 200;
  res.setHeader('content-Type' , 'text/html')
  res.end('<h1> This is my home page </h1>')
  
});

server.listen(3000, () => {
  console.log(`Server is running on port: ${port}`);
});
