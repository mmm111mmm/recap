// WORK IN PROGRESS

// THIS SHOWS YOU HOW TO USE EXPRESSJS SESSIONS
// AND KEEP USERS LOGGED IN
// Although there's no saving of users,
// fetching useres, comparing passwords etc
//
// That will come next.



// #####################
// # Setup Mongo, Mongoose, Sessions and Express
// #####################

// This means we must run 'npm install express express-session mongoose connect-mongo'
const express    = require('express')
const app        = express()
const session    = require("express-session");
const mongoose   = require("mongoose");
const MongoStore = require("connect-mongo")(session);
//
// Connect to a Mongo database
// This database will be used by ExpressJS session
// to store the current users who are logged in.
mongoose.connect('mongodb://localhost/my_recap_database', {useNewUrlParser: true})
.then(function(connection) {
  console.log(`Connected to Mongo! Database name: "${connection.connections[0].name}"`)
})
.catch(function(error) {
  console.error('Error connecting to mongo', error)
});
//
// Let's now use ExpressJS session
// This allows us to save things on
// the request.session object.
// 
// And anything we store on this object
// will be saved in MongoDB for that
// particular user.
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({ // Store our session data in Mongo
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // Delete this session in one day
  })
}))
//
// Start ExpressJS
app.listen(3000, function() {
  console.log('My app listening on port 3000!')
})

// #####################
// # A route to show login and logout buttons
// # It will also show a link to the 'secret' page
// #####################

app.get('/', function(request, response, next) { 
  var loggedIn = false
  if(request.session.currentUser) {
    loggedIn = true;
  }

  response.send(`
    <a href="/login">login</a><br>
    <a href="/logout">logout</a>
    <div>You are currently logged in? ${loggedIn}</div>
    <hr>
    <a href="/secret">Go to secret page</a>
  `)
});

// #####################
// # Login and logout routes
// #####################

app.get('/login', function(request, response, next) { 
  request.session.currentUser = { name: "Aaron" }
  response.redirect("/")
});

app.get('/logout', function(request, response, next) { 
  request.session.destroy(function(error) {
    console.log("Couldn't destroy the sesson", error)
  })
  response.redirect("/")
});

// #####################
// # This is the page we redirect to if they're not logged in
// #####################


app.get('/not_allowed', function(request, response, next) { 
  response.send(`Naughty, naughty - you're not logged in. Go back and login.`)
});

// #####################
// # This is the middleware that 
// # prevents unlogged in users
// # from accessing /secret.
// #####################


app.use("/secret", function (request, response, next) {
  console.log("In secret")
  if (request.session.currentUser) { 
    next(); 
  } else { 
    response.redirect("/not_allowed");
  }
});

// #####################
// # Here's the 'secret' page, protecting by the
// # user session and the middleware.
// #####################

app.get("/secret", function(request, response, next) {
  response.send("Secret page");
});