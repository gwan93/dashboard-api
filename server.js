require('dotenv').config();
const express = require("express");
const bcrypt = require('bcryptjs');
const cors = require("cors");
const { getAllCustomers, createCustomer } = require('./db/queries/customers');
const { checkUserPassword } = require('./db/queries/users');

const PORT = process.env.PORT || 3001;
const app = express();
const salt = bcrypt.genSaltSync(10);
const cookieSession = require('cookie-session');
const sessionConfig = {
  name: "session",
  secret: "aSecretForCookies!"
}
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieSession(sessionConfig));
app.use(cors());


// Connect to DB
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Middleware Function to check if user is logged in by reading cookie
const isLoggedIn = (req, res, next) => {
  if (req.session.user_id && req.session.username) {
    next();
  } else {
    res.send("Unauthorized access.");
  }
};

// Endpoints
app.get("/customers", isLoggedIn, (req, res) => {
  getAllCustomers(db)
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.send(err);
  })
});

app.post("/customers", isLoggedIn, (req, res) => {
  const {createdBy, first, last, profession} = req.body;
  createCustomer(db, createdBy, first, last, profession)
  .then(response => {
    res.json(response);
  })
  .catch(err => {
    res.json(err)
  })
})

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  checkUserPassword(db, username)
  .then(response => {
    if (bcrypt.compareSync(password, response.password)) {
      req.session.user_id = response.id;
      req.session.username = response.username;
      res.json({status: 200, username: response.username, id: response.id})
    } else {
      res.json({status:401})
    }
  })
  .catch(err => {
    console.log('error', err)
    res.json(err)
  })
})

app.post("/logout", isLoggedIn, (req, res) => {
  req.session = null;
  res.send({status: 200});
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});