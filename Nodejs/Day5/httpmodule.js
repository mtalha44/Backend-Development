// const http = require('node:http');

// const port = process.env.PORT || 3000;
// const server = http.createServer((req, res) => {
//   console.log(req.url) 
//   res.statusCode = 200;
//   res.setHeader('content-Type' , 'text/html')
//   res.end('<h1> This is my home page </h1>')
  
// });

// server.listen(3000, () => {
//   console.log(`Server is running on port: ${port}`);
// });


const http = require('http');
const server = http.createServer((req , res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type' , 'text/plain');
  res.end('Hello , World from Node.js HTTP Server ! \n');
})

server.listen( 5173 , 'localhost' , () => {
  console.log('server running at http:localhost:5173/')
})