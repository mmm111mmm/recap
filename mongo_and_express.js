// TODO: Add more comments

// ####################
// # This deals with everything in: 
// # "Mongoose&Express | Create - Update Documents"
// # http://learn.ironhack.com/#/learning_unit/6494
// # And
// # "Mongoose&Express | List - Read Documents"
// # http://learn.ironhack.com/#/learning_unit/6490
// ####################

// This shows how to use ExpressJS and Mongo and Mongoose
// to make a CRUD app (Creating, Reading, Updating and Deleteing something from a database)

// IMPORTANT: This file assumes you've read express_handlebars.js and promises.js
// and mongo.js.

// Note: We're not dealing with error messages in this app.
// Specifically, we're not telling the website user about them.
// We'll look at dealing with them later.


// `require` packages for Express, Mongoose and bodyParser (to help with POST routes)
// This means you must do `npm install expres mongoose and body-parser` in this directory
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

// ############
// # 
// # We're now going to setup Express and Mongoose
// #
// #############

// Setup Expressjs
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
// #############

// A GET route to show the HTML form to post  new song
app.get('/add', function(request, response, next) { 
  response.render('add_song');
})

// A POST route to add the song to Mongo
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
// # Let's setup a route to delete a song
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


// ############
// # 
// # Let's setup routes to update a song
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




// There is a reference of all the possible Mongoose calls here: https://mongoosejs.com/docs/api.html#Model
//
