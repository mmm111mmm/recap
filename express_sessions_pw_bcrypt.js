// WORK IN PROGRESS

// #####################
// # Setup Mongo, Mongoose, Sessions and Express
// #####################

// This means we must run 'npm install express express-session mongoose connect-mongo'
const express      = require('express')
const app          = express()
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");
const session      = require("express-session");
const ConnectMongo = require("connect-mongo");
const bcrypt       = require("bcrypt")
const MongoStore   = ConnectMongo(session);

mongoose.connect('mongodb://localhost/my_recap_database', {useNewUrlParser: true})
var mongoStore = new MongoStore({ 
  mongooseConnection: mongoose.connection,
  ttl: 24 * 60 * 60
})

app.use(session({
  secret: "some random stuff - put anything here",
  cookie: { maxAge: 60000 }, 
  store: mongoStore
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, function() {
  console.log('My app listening on port 3000!')
})


const userSchema = { username: String, password: String };
const User = mongoose.model('my_recap_users_encrypted', userSchema);


// #####################
// # 
// #####################

app.get("/register", function(request, response, next) {
  response.send(`
    <h1> Register </h1>
    <form action="register_post" method="post">
      <input name="username" placeholder="username">
      <input name="password" placeholder="password">
      <button type="submit">register</button>
    </form>
  `);
});

// #####################
// # 
// #####################

app.post("/register_post", function(request, response, next) {

  const salt     = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(request.body.password, salt);

  var user = {
    username: request.body.username, 
    password: hashPass
  }

  User.create(user)
  .then(function(success) {
     console.log("Successfully added a user", success)
     response.redirect("/")
  })
  .catch(function(error) {
    console.log("Error adding the user", error)
    response.send(`
      <h1>Error adding the user</h1>
    `)
  })
  
});

// #####################
// #
// #####################

app.get("/login", function(request, response, next) {
  response.send(`
    <h1> Login </h1>
    <form action="login_post" method="post">
      <input name="username" placeholder="username">
      <input name="password" placeholder="password">
      <button type="submit">login</button>
    </form>
  `);
});

// #####################
// # 
// #####################

app.post("/login_post", function(request, response, next) {

  var attemptedLogin = {
    username: request.body.username
  }

  User.findOne(attemptedLogin)
  .then(function(userFromMongo) {
    console.log("Found this user on login attempt", userFromMongo)
    if(userFromMongo == null) {
      response.send(`
        Couldn't find that user.
      `)
    } else {
      var goodPassword = bcrypt.compareSync(request.body.username, userFromMongo.password)

      if(goodPassword) {
        response.send(`
          Your password was incorrect.
        `)
      } else {
        request.session.currentUser = userFromMongo
        response.redirect("/")          
      }
    }
  })
  .catch(function(error) {
    console.log("Not found this user", error)
    response.send(`
      Error finding that user.
    `)
  })
  
});

// #####################
// # 
// #####################

app.get('/', function(request, response, next) { 
  
  var areLoggedIn = "You are not logged in."
  if(request.session.currentUser) {
    areLoggedIn = "You are: " + request.session.currentUser.username
  }

  response.send(`
    <a href="/login">login</a>
    <a href="/logout">logout</a>
    <a href="/register">register</a>
    <hr>
    <div><b>${areLoggedIn}</b></div>
  `)
});

// #####################
// # 
// #####################

app.get('/logout', function(request, response, next) { 
  request.session.destroy(function(error) {
    if(error) console.log("Couldn't destroy the sesson")
  })
  response.redirect("/")
});
