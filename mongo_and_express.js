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

  // Firstly the user has used a HTML form to give us some data
  // That now lives in `request.body.song_title`
  // We're going to create a simple javascript object with that information
  // in it.

  // Note, that this object confirms to the Mongoose schema we specified
  // const songSchema = { song_title: String, artist: String };

  var newsong = {
    song_title: request.body.song_title,
    artist: request.body.artist
  }

  // We now use `Song.create` and pass in our object from above
  // Note: Song.create() gives us a Promise.

  Song.create(newsong)
  .then(function() {
    // If we successfully created the song
    // then we redirect to our / route
    // (We'll see this defined below)
    response.redirect('/');
  })
  .catch(function(error) {
    // If there was an error adding our song,
    // like if mongodb has been shut down,
    // Then the 'catch' part of our Promise
    // will be called.
    console.log("error adding song", error)
    // We're just going to render an error page.
    // In a bigger app we'd tell the user what the 
    // error was. (We'll learn this later)
    response.render("error")
  })

  // Note: the response.render()s are only inside
  // the Promise, since we want to wait for the Promise,
  // and therefore Mongo, to complete before 
  // talking to the client (i.e. user)

})



// ############
// # 
// # Let's setup a route to list our songs
// #
// # The R in CRUD (read)
// #
// #############

// This is the route that the /add_song_post_route
// route redirects too when a song was successfully
// added.

// This route will live at http://localhost:3000/
app.get('/', function(request, response, next) { 

  // We're going to use Song.find() to fetch all our songs.
  // This returns a Promise.

  // If you remember this http://learn.ironhack.com/#/learning_unit/6471
  // lesson we learn about all the ways to find Documents in Mongo.
  // For example, sorting, find only records with such and such data.
  // 
  // This is the call where we can do all that.
  //
  // To find only the Documents that have "The Beatles" as an artist
  // you'd say Song.find({ artist: "The Beatles" })
  //
  // If you wanted to sort the songs, you'd do
  // Song.find().sort({ artist: -1 })
  //
  // In our case, we're just returning all the documents in any order

  Song.find()
  .then(function(mongoSongs) {
    // If our find() call succeeded,
    // then .then() part of our Promise
    // will have all the songs in them.
    //
    // That is, mongoSongs is an array of songs 
    // like this:
    //
    // [ { _id: "5c582d22005ffe4a3414e234",
    //     song_title: "Aaron",
    //     artist: "Paul Kalkbrenner"
    //   },
    //   { _id: "5c582d22005ffe4a3414e234",
    //     song_title: "Rocky Racoon",
    //     artist: "The Beatles"
    //   }
    // ]

    // We're putting all that into an object
    // that we will pass to our handlebars file
    var oursongs = {
      songs: mongoSongs
    }

    // We'll use handlebars to display all the
    // songs in our oursongs object.
    response.render('list_songs', oursongs);
  })
  .catch(function(error) {
    // If there was an error adding our song,
    // like if mongodb has been shut down,
    // Then the 'catch' part of our Promise
    // will be called.    
    console.log("Error listing", error)
    // We're just going to render an error page.
    // In a bigger app we'd tell the user what the 
    // error was. (We'll learn this later)    
    response.render("error")
  });

})



// ############
// # 
// # Let's setup routes to update a song
// #
// # The U in CRUD
// #
// #############

// We're going to allow the user to edit a song.
// In our list_songs.hbs file we have this line.
//
//   <a href="/update/{{ this._id }}">Update</a>
//
// This uses the _id variable that's given to us
// via Mongo (remember we're iterating over an
// array that Mongo gave us in list_songs.hbs) 
//
// So when we click on the above link it will take us
// to the following route.

// This route will live at http://localhost:3000/update/some_id_from_mongo
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
    response.render("error")
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
    response.render("error")
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
    response.render("error")
  })

})

// There is a reference of all the possible Mongoose calls here: https://mongoosejs.com/docs/api.html#Model
