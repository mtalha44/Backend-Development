require("dotenv").config({path: "./secret.env"});

const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname , "public")))

app.set("view engine", "ejs");

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error(err));

app.use("/api/auth", require("./routes/auth"));

// Assuming your view engine is already set up with app.set('view engine', 'ejs');

// Route to render the registration page
app.get('/register', (req, res) => {
  res.render('register');
});

// Route to render the login page
app.get('/login', (req, res) => {
  res.render('login');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
