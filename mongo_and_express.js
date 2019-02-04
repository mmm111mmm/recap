// WORK IN PROGRESS
// This shows how to use ExpressJS and Mongo and Mongoose
// to make a CRUD app (Creating, Reading, Updating and Deleteing something from a database)



// Note: We're not dealing with error messages in this app.
// Specifically, we're not telling the website user about them.



// `require` various packages
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

// setup expressjs
const app = express()
// Note: we're in a subdirectory of views/ this time
app.set("views", __dirname + "/views/mongo_and_express/")
app.set("view engine", "hbs")
app.use(bodyParser.urlencoded({ extended: true }));
//setup mongoose and point it at our database
mongoose.connect('mongodb://localhost/my_recap_database', { useNewUrlParser: true });
// setup mongoose model
const songSchema = { song_title: String, artist: String };
const Song = mongoose.model('my_recap_songs', songSchema);


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



app.listen(3000, function() {
  console.log("Listening on port 3000")
})



// There is a reference of all the possible Mongoose calls here: https://mongoosejs.com/docs/api.html#Model
