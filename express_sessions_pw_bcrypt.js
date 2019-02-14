// #####################
// # What we're building
// #####################

// We've learnt about using Sessions
// We're now going to create a website where
// you can register, login and logout.
// And the Session will remember you're logged in.
//
// And there'se a 'secret' page you can only
// go to once you're logged in.

// And we will encrypt the passwords using Bcrypt.

// IMPORTANT: This file assumes you've understood
// 0. express_handlebars.js 1. promises.js
// 2. mongo.js 3. mongo_and_express.js
// 4. express_sessions.js

// Run this by 'npm npm install express express-session mongoose connect-mongo bcrypt'
// And 'node express_sessions_pw_bcrypt.js'

// IMPORTANT: We're not dealing with errors in this file
// For example, if two users try to register with
// the same name - an error will happen but we don't 
// give the user an informative error message.
// We can learn how to do that later.

// #####################
// # Why encrypt passwords?
// #####################

// Imagine you didn't.

// Imagine all the passwords were plain text in our database.

// Now realise most users use the same password for every
// account they have.

// Now imagine someone steals your database.

// Now imagine that it goes public that you've leaked all
// your users passwords.

// #####################
// # Setup Mongo, Mongoose, Sessions and Express
// # See express_sessions.js for explanations
// #####################

// This means we must run 'npm install express express-session mongoose connect-mongo'
const express      = require('express')
const app          = express()
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");
const session      = require("express-session");
const ConnectMongo = require("connect-mongo");
// This is new and will be used to encrypt our passwords
const bcrypt       = require("bcrypt")
const MongoStore   = ConnectMongo(session);

mongoose.connect('mongodb://localhost/my_recap_database', {useNewUrlParser: true})
var mongoStore = new MongoStore({ 
  mongooseConnection: mongoose.connection,
  ttl: 24 * 60 * 60
})

app.use(session({
  secret: "some random stuff - put anything here",
  cookie: { maxAge: 6000000 }, 
  store: mongoStore,
  resave: true,
  saveUninitialized: true 
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, function() {
  console.log('My app listening on port 3000!')
})

// #####################
// # Let's create a Mongoose Model to
// # save information about our users
// #####################

const userSchema = { username: String, password: String };
const User = mongoose.model('my_recap_users', userSchema);


// #####################
// # Let's make a register GET route that 
// # shows our HTML form to register a user.
// #####################

app.get("/register", function(request, response, next) {
  response.send(`
    <h1> Register </h1>
    <form action="register_post" method="post">
      <input name="username" placeholder="username">
      <input name="password" type="password" placeholder="password">
      <button type="submit">register</button>
    </form>
  `);
});

// Here's where we go to when the 
// user presses submit

app.post("/register_post", function(request, response, next) {

  // The salt is used to randomised hashed passwords
  // This means one hash for 'password' will be different
  // to another hash for 'password'. This is very good
  // for security. Refer to the lecture notes for more 
  // information.
  const salt              = bcrypt.genSaltSync(10);
  // We use that salt with the password we got from the HTML form
  // with bcrypt to give us an encrypted password.
  const encryptedPassword = bcrypt.hashSync(request.body.password, salt);

  // Let's use that password and the username from the HTML form
  // to make a object (that confirms to our user Mongoose Schema)
  var user = {
    username: request.body.username, 
    password: encryptedPassword
  }

  // Let's now use that user object to add a new user
  // to Mongo
  User.create(user)
  .then(function(success) {
     console.log("Successfully added a user", success)
     // Let's just go back to the 
     // main page.
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
// # Here's a GET route that shows the user
// # a HTML form to login.
// #####################

app.get("/login", function(request, response, next) {
  response.send(`
    <h1> Login </h1>
    <form action="login_post" method="post">
      <input name="username" placeholder="username">
      <input name="password" type="password" placeholder="password">
      <button type="submit">login</button>
    </form>
  `);
});

// Here's where we go to when the 
// user presses submit

app.post("/login_post", function(request, response, next) {

  // We're getting the username from the HTML form that 
  // was submitted.

  var attemptedLogin = {
    username: request.body.username
  }

  // We'll use the above to search Mongo for
  // a user with the above username.

  User.findOne(attemptedLogin)
  .then(function(userFromMongo) {
    console.log("Found this user on login attempt", userFromMongo)
    if(userFromMongo == null) {
      // It's possible the .then() part of the promise
      // submitted but still Mongo found no user.
      // The .catch is normally called when the database is down.
      response.send(`
        Couldn't find that user.
      `)
    } else {
      // Let's use bcrypt to check if the password we got 
      // from the HTML form is the same as the password
      // we encryped in the database.
      var goodPassword = bcrypt.compareSync(
        request.body.username, 
        userFromMongo.password
      )

      if(goodPassword) {
        // Save the user from Mongo to
        // our session
        request.session.currentUser = userFromMongo
        // Let's just go back to the main page
        response.redirect("/")          
      } else {
        response.send(`
          Your password was incorrect.
        `)
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
// # The main page of our website.
// # You can register, login, logout and see if you're
// # logged in.
// #####################

app.get('/', function(request, response, next) { 
  
  var areLoggedIn = "You are not logged in."
  // Let's look at the session
  // which will be modifed in the 'login' POST
  // route. If it exists, tell the user they
  // are logged in.
  if(request.session.currentUser) {
    areLoggedIn = "You are: " + request.session.currentUser.username
  }

  response.send(`
    <a href="/login">login</a>
    <a href="/logout">logout</a>
    <a href="/register">register</a>
    <hr>
    <div><b>${areLoggedIn}</b></div>
    <hr>
    <a href="secret/">Go to secret page</a>
  `)
});


// #####################
// # Here's some node middleware
// # that only allows you to go to
// # the /secret route if you're logged in
// # i.e. if you have request.session.currentUser
// #####################

// Note .use
// And note we're only applying this middleware
// to /secret
app.use("/secret", function(request, response, next) {
  if(request.session.currentUser) {
    // if we do have the currentUser object, go
    // to the /secret route, i.e. the next route
    next()
  } else {
    response.send(`
      <h1>You need to login, friend</h1>
    `)
  }
})


// Because of the above middleware
// We will only go to this page if the
// user is logged in - i.e. there is a
// request.session.currentUser object

app.get("/secret", function(request, response, next) {
  response.send(`
    <h1>Super secret page</h1>
  `)
})


// #####################
// # Destroy the sesssion, and take
// # the user back to the main page.
// #####################

app.get('/logout', function(request, response, next) { 
  request.session.destroy(function(error) {
    if(error) console.log("Couldn't destroy the sesson")
  })
  response.redirect("/")
});
