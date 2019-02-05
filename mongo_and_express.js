// ####################
// # We previously learnt about expressJS.
// # And we learnt about Promises.
// # And we learnt about Mongo and Mongoose 
// # (at least, setup and how to add documents)
// #
// # Now we will learn how to Create, Read, Update and Delete
// # documents. And we will do this using
// # expressJS routes.
// #
// # That is, we will create a CRUD app.
// #
// # Our CRUD app will allows us to Create, Read, Update
// # and Delete songs to a database.
// #
// ####################

// You can run this file by first importing everything
// npm install expres mongoose and body-parser
// Then 
// node mongo_and_express.js

// IMPORTANT: This file assumes you've read express_handlebars.js and promises.js
// and mongo.js.

// ####################
// # This deals with everything in: 
// # "Mongoose&Express | Create - Update Documents"
// # http://learn.ironhack.com/#/learning_unit/6494
// # And
// # "Mongoose&Express | List - Read Documents"
// # http://learn.ironhack.com/#/learning_unit/6490
// ####################

// Note: We're not dealing with error messages in this app.
// We just redirect to an error page.
// You must check the nodejs console for any errors.
// We'll look at telling the user about errors later.



// ############
// # 
// # We're now going to setup Express and Mongoose
// #
// #############

// `require` packages for Express, Mongoose and body-parser (to help with POST routes)
// This means you must do `npm install expres mongoose and body-parser` in this directory
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

// Setup Expressjs, Handlebars and body-parser
const app = express()
// Note: we're in a subdirectory of views/ this time
app.set("views", __dirname + "/views/mongo_and_express/")
app.set("view engine", "hbs")
app.use(bodyParser.urlencoded({ extended: true }));
// Start our ExpressJS server
app.listen(3000, function() {
  console.log("Listening on port 3000")
})

// Setup Mongoose and point it at our database
mongoose.connect('mongodb://localhost/my_recap_database', { useNewUrlParser: true });
// Setup mongoose model
// This Scheme specfies that we'll save the song_title
// and artist of our song in a Mongo collection called "my_recap_songs"
const songSchema = { song_title: String, artist: String };
// Now get our 'Song' object that let's us
// add, delete, update and list our songs
const Song = mongoose.model('my_recap_songs', songSchema);



// ############
// # 
// # Let's setup routes to add songs
// #
// # The C in CRUD
// # 
// #############

// First of all, we are going to make a GET route
// and this will take the user to a HTML form
// where they can enter song data.

// This route will live at http://localhost:3000/add
app.get('/add', function(request, response, next) { 
  // The HTML form in add_song.hbs will look like this
  /*
  <form action="/add_song_post_route" method="POST">
    <input name="song_title" placeholder="Enter the name of the song">
    <br>
    <input name="artist" placeholder="Enter the name of the artist">
    <br>
    <button type="submit">Add song</button>
  </form>
  */
  // Note how it will send the user to the POST
  // route /add_song_post_route

  response.render('add_song');
})

// When the user goes to http://localhost:3000/add
// then fills in the form, then presses submit
// they will be taken to the /add_song_post_route POST route

// In this route we will grab the song data that is passed
// to us, and then we will add it to the Mongo database.

// This route will live at http://localhost:3000/add_song_post_route
app.post('/add_song_post_route', function(request, response, next) { 

  var newsong = {
    song_title: request.body.song_title,
    artist: request.body.artist
  }

  Song.create(newsong)
  .then(function() {
    response.redirect('/');
  })
  .catch(function() {
    console.log("error adding song")
  })

})



// ############
// # 
// # Let's setup a route to list our songs
// #
// # The R in CRUD (read)
// #
// #############

// A GET route to show all our songs
app.get('/', function(request, response, next) { 

  Song.find()
  .then(function(mongoSongs) {
    var oursongs = {
      songs: mongoSongs
    }
    console.log("Success getting all our songs via Mongoose's find", oursongs)
    response.render('list_songs', oursongs);
  })
  .catch(function(error) {
    console.log("Error listing", error)
  });

})



// ############
// # 
// # Let's setup routes to update a song
// #
// # The U in CRUD
// #
// #############

// A GET route that will show a form to update a song.
app.get('/update/:id', function(request, response, next) { 

  var mongoDocumentId = request.params.id
  var mongoFilter = { _id: mongoose.Types.ObjectId(mongoDocumentId) } 

  Song.findOne(mongoFilter)
  .then(function(songFromMongo) {
    var oursong = {
      song: songFromMongo 
    }
    response.render("update_song", oursong)
  })
  .catch(function(error) {
    console.log("Error showing the update form", error)
  });

})

// A POST route that will update our song collecting with the user's input
app.post('/update_song_post_route', function(request, response, next) { 

  var mongoDocumentId = request.body.id
  var mongoFilter = { _id: mongoose.Types.ObjectId(mongoDocumentId) } 

  var updatedSong = {
    song_title: request.body.song_title,
    artist: request.body.artist
  }

  Song.updateOne(mongoFilter, updatedSong)
  .then(function(success) {
    console.log("Updated our post, apparently", success)
    response.redirect('/');
  })
  .catch(function() {
    console.log("error updating song")
  })

})



// ############
// # 
// # Let's setup a route to delete a song
// #
// # The D in CRUD
// #
// #############

// A GET route that will delete a song
app.get('/delete/:id', function(request, response, next) { 

  var mongoDocumentId = request.params.id
  var mongoFilter = { _id: mongoose.Types.ObjectId(mongoDocumentId) } 

  Song.deleteOne(mongoFilter)
  .then(function(success) {
    console.log("Apparently we deleted something", success)
    response.redirect("/")
  })
  .catch(function(error) {
    console.log("Error deleting item", error)
  })

})

// There is a reference of all the possible Mongoose calls here: https://mongoosejs.com/docs/api.html#Model
//
