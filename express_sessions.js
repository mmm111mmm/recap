// WORK IN PROGRESS

// THIS SHOWS YOU HOW TO USE EXPRESSJS SESSIONS
// TO KEEP USER SPECIFIC DATA.
//
// There's nothing about password or user accounts yet.
//
// That will come next.

// #####################
// # Setup Mongo, Mongoose, Sessions and Express
// #####################

// This means we must run 'npm install express express-session mongoose connect-mongo'
const express      = require('express')
const app          = express()
const mongoose     = require("mongoose");
const session      = require("express-session");
const ConnectMongo = require("connect-mongo");
const MongoStore   = ConnectMongo(session);

// Let's connected to a Mongo database

mongoose.connect('mongodb://localhost/my_recap_database', {useNewUrlParser: true})

// Let's use Mongo to store our session.
// We'll create a MongoStore which EspressJS
// will use below.

// We give MongoStore our Mongoose connection that
// we started above.
//
// And we give it a Time To Life, which means
// long long this should live before it's 
// destroyed.
//
// We don't want to keep around millions of 
// user sessions since they'll take up too much
// space on our computer - so we automatically
// delete them after a TTL.

var mongoStore = new MongoStore({ 
  mongooseConnection: mongoose.connection,
  ttl: 24 * 60 * 60 // Mongo deletes this session in one day
})

// Let's now use ExpressJS session.
//
// This allows us to save things on
// the request.session object in the
// routes.
//
// And we use our MongoStore object to save
// our session.
//
// We tell the browser to delete the cookie after 60000 seconds
//
// The 'secret' is a arbitrary string that 
// helps keep the session key random.

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 }, 
  store: mongoStore
}))

// Start ExpressJS

app.listen(3000, function() {
  console.log('My app listening on port 3000!')
})


// #####################
// # A route to show login and logout buttons
// # It will also show a link to the 'secret' page
// #####################

app.get('/', function(request, response, next) { 

  if(request.session.currentUser == undefined) {
    request.session.currentUser = { oranges: 0 }
  }
  
  response.send(`
    <div>You have ${request.session.currentUser.oranges} in your basket</div>
    <hr>
    <a href="/add_to_basket">buy an orange</a>
    <hr>
    <a href="/logout">logout</a>
  `)
});

// #####################
// # Here's the route that allows
// # you to modify the user session
// #####################

app.get("/add_to_basket", function(request, response, next) {
  request.session.currentUser.oranges++;
  response.redirect("/");
});

// #####################
// # Here's the route that destroys
// # all the data in the user session.
// # Or 'logout' as we normally call it.
// #####################

app.get('/logout', function(request, response, next) { 
  request.session.destroy(function(error) {
    console.log("Couldn't destroy the sesson", error)
  })
  response.redirect("/")
});
