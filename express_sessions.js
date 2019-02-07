// ##########################
// # What's a Session?
// ##########################

// We need a way to remember the user when they 
// come back to our website.

// For example, Amazon remembers it's you when you
// reopen Amazon. (If you've logged in first)

// A Session is a way for the server to remember the user.

// And a Session is a way to keep information about the user e.g.
// Theser's name is "Aaron". Etc.
// It stores this as a normal javascript object.

// ##########################
// # What's a Cookie?
// ##########################

// A Cookie is a small text file the server gives the client's browser.
// It's stored in the user's web browser.

// This cookie has a long random string in it, like this: 4DFJALIO6KDFNA

// And everytime the user uses your website the user's browser
// sends this cookie (and that long random string) to your nodejs server.

// So the server can use that Cookie to know it's you.

// ##########################
// # How do Sessions and Cookies work togther?
// ##########################

// When you setup Express and Sessions (which we'll do below)
// then Express will send a Cookie to the user.

// Subsequently, every time the user uses your website they'll
// send that Cookie back to Express.

// Express will say 
// "Ah, I know Cookie 4DFJALIO6KDFNA!"
// "I know that Cookie and I have Session object for it.
//  I have stored the Session object in Mongo.
//  And that javascript object is:
//  { name: "Aaron" } etc

// That javascript object is called the Session object
// and it lives in `request.session` in the routes

// You can, then, modify that javascript object.
// For example, you can destroy it when the user
// logs out, or modify it to remember items the
// user has added to a shopping basket.


// #####################
// # 
// # Let's make a simple app with Sessions.
// #
// # * When the user goes to the Login page, they will
// #   input their username (no passwords in this example)
// #
// # * We will then remember their username in our session.
// # 
// # * Then when they go to the main page, we'll display that
// #   username 
// #
// # * Even if they close the browser and open it again their
// #   session will still be there - we'll still remmeber them.
// #####################


// #####################
// # Setup Mongo, Mongoose, Sessions and Express
// #####################

// This means we must run 'npm install express express-session mongoose connect-mongo'
const express      = require('express')
const app          = express()
const bodyParser   = require('body-parser');
const mongoose     = require("mongoose");
// This allows us to use sessions
const session      = require("express-session");
// We'll store our session objects in Mongo
const ConnectMongo = require("connect-mongo");
// Specifically, we'll sotre our session objects via MongoStore
const MongoStore   = ConnectMongo(session);

// Let's connected to a Mongo database

mongoose.connect('mongodb://localhost/my_recap_database', {useNewUrlParser: true})

// Let's use Mongo to store our session javascript object.
// We'll create a 'MongoStore' which EspressJS
// will use below.

// We give MongoStore our Mongoose connection that
// we started above.
//
// And we give it a Time To Life, which means
// how long this should live before it's
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
// helps keep the session key random - so it's not gussable
// You can put anything here.

app.use(session({
  secret: "some random stuff - put anything here",
  cookie: { maxAge: 60000 }, 
  store: mongoStore,
  resave: true, // save the session even if it's not been modified
  saveUninitialized: true // save the session before it's been modified
}))

app.use(bodyParser.urlencoded({ extended: true }));
// Start ExpressJS
app.listen(3000, function() {
  console.log('My app listening on port 3000!')
})

// #####################
// # Show the user a HTML
// # form where they enter their username.
// # They are sent to our 'login_post' route.
// #####################

app.get("/login", function(request, response, next) {
  response.send(`
    <form action="login_post" method="post">
      <input name="username" placeholder="username">
      <button type="submit">login</button>
    </form>
  `);
});

// Once the user clicks submit on the HTML form above
// then we end up here.
// And we save the data from the POST body to our session
// as the object 'currentUser'.

app.post("/login_post", function(request, response, next) {

  request.session.currentUser = {
    username: request.body.username
  }
  
  response.redirect("/")
});

// #####################
// # We look to see if we have the 
// # 'currentUser' object in our session.
// # (We create 'currentUser' in our login POST route)
// # If so, let's display their username.
// #####################

app.get('/', function(request, response, next) { 
  
  var username = "Unknown user"
  if(request.session.currentUser) {
    username = request.session.currentUser.username
  }

  response.send(`
    <a href="/login">login</a>
    <a href="/logout">logout</a>
    <hr>
    <div>Welcome, ${username}</div>
  `)
});

// #####################
// # Let's destroy the session
// # And thus the 'currentUser' session object.
// #####################

app.get('/logout', function(request, response, next) { 
  request.session.destroy(function(error) {
    if(error) console.log("Couldn't destroy the sesson")
  })
  response.redirect("/")
});
