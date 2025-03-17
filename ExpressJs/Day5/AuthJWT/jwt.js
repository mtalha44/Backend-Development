const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(cookieParser());

app.get("/", (req, res) => {
  // Create a JWT token with a payload and secret key
  const token = jwt.sign({ email: "mt4458649@gmail.com" }, "secretkey");
  // Set the token in a cookie
  res.cookie("token", token);
  res.send("done");
});

app.get("/read", (req, res) => {
  // Retrieve token from cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("No token provided");
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, "secretkey");
    res.send(decoded);
  } catch (err) {
    res.status(401).send("Invalid token");
  }
  
});

app.listen(3003, () => {
  console.log("Server running on port 3003");
});
