// WORK IN PROGRESS

// Before, when we created GET and POST routes with express, the data disppeared after the request.
// 
// If we want to save data between requests, like saying a new user or facebook post for example, we need to use a database.
//
// The database we will be using is Mongo. 
//
// We normally use Mongo from within an express route. But we don't have to.
//
// In this file, we'll just be using Mongo and Mongoose without expressjs.
//
// #########
// #
// # The section deals with using Mongo without Mongoose and with Javascript Promises
// #
// #########

// We previously learn about connecting to Mongo with promises.
// If this is new to you, read the promises.js file in this repository.

// We're going to write some javascript that adds a song to our new Mongo collection.

var Mongo = require("mongodb")
var MongoClient = Mongo.MongoClient
var url = "mongodb://localhost:27017/";

// We will fill this with our mongo collection object later
// Then we'll use it to find, add, delete etc from the collection
var songsCollection; 

MongoClient.connect(url, { useNewUrlParser: true })
.then(function(mongo) {
  //console.log("Hooray we've connected to the database")
  return mongo.db("my_recap_database").collection("my_recap_songs")
})
.then(function(collection) {
  //console.log("Hooray we've connected to the collection")
  songsCollection = collection; // save it from later use
  var song_data = {
    "song_title" : "Gimme Shelter",
    "artist" : "The Rolling Stones"	
  }
  return collection.insertOne(song_data)
})
.then(function(goodResult) { // Mongo gives us a object from insertOne's promise
  //console.log("We've added something to the database!")
  // This returns a promise that looks at all the data in our collection 
  // We have to say "toArray" so it gives us an array
  // And we're using the songsCollection we previously saved
  return songsCollection.find().toArray() 
})
.then(function(songsResult) { // Mongo gives us the results from find()'s promise
  //console.log("We got the results")
  // We could print out songResult to see them all
})
.catch(function(results) {
   console.log("Some kind of monogo error", results)
})

// You can see we're adding something to mongo. To be precise, we're adding:
/*
{
  "song_title" : "Gimme Shelter",
  "artist" : "The Rolling Stones"	
}
*/

// This works well, and it's pure Mongo.
// But we're going to use something called Mongoose


// #########
// #
// # The section deals with using Mongo with Mongoose.
// # It only deals with creating new records. We'll deal
// # with updating, deleting and fetching records in the next file.
// #
// # This relates to the lecture: http://learn.ironhack.com/#/learning_unit/6481
// #
// #########

// There is another way to add, delete, update and fetch data from Mongo.
// And this is called Mongoose. It has many features.
//
// But for the moment we'll just focus on connecting to our 
// database and collection adding records to that collection.
//
// We'll talk about its advanced features, include the Schema in more default, later.
//
// We start by including mongoose via npm 'npm install mongoose'
//
// Then we must include it:
const mongoose = require('mongoose');
// Then connect to our database, and you also specify the database name
// We also say { useNewUrlParser: true } to tell Mongo we're using the URL format 
// (which we are).
mongoose.connect('mongodb://localhost/my_recap_database', { useNewUrlParser: true });
//
// Mongoose uses something called a Model.
// This is an Javascript object that relates to a Mongo collection.
// With this object we will add, delete, update and fetch data from that collection.
//
// We make a model with `mongoose.model()`.
// * The first parameter is the database collection name
// * The second line is what we call a schema.
//
// A schema tells Mongoose what our
// data object willl look like.
//
// For example, "it will have a field called song_title, and that will be a string", etc
//
// The scheme will look like this:
// {
//   fieldName: fieldType,
//   another:   fieldType,
// }
//
// And the field type can String, Number, Array, Object, Boolean, etc.
// We will talk about this in more detail later.
//
const songSchema = { song_title: String, artist: String };
const Song = mongoose.model('my_recap_songs', songSchema);

// Now we've create a Mongoose model, we can start using the `Song` object.
//
// We can create new song by saying `Song.create` and as its argument
// we pass a javascript object that confirms to the schema we created.
//
// In other words, the object will have the same names as in our schema, and
// the same type of data.

Song.create({ song_title: "Rocky Raccoon", artist: "The Beatles"} )
.then(function(success) {
  console.log("Success adding with Mongoose's create")
})
.catch(function(error) {
  console.log("Error adding", error)
});

// You can create many objects with `create` too.

var songs = [
  { song_title: "So what", artist: "Miles Davis" },
  { song_title: "All blues", artist: "Miles Davis" }
]

Song.create(songs)
.then(function(success) {
  console.log("Success adding with Mongoose's create (adding multiple songs)" )
})
.catch(function(error) {
  console.log("Error adding", error)
});

// You can also use insertMany for the same thing

Song.insertMany(songs)
.then(function(success) {
  console.log("Success adding with Mongoose's insertMany")
})
.catch(function(error) {
  console.log("Error adding", error)
});

// TODO: Using 'new'

// TODO: Promises are not sequential.

// Let's talk about unique ids.

// For each document ( i.e. the song) we entered, mongo did something automatically for us
// Mongo gave us an _id field. 
// 
// Look into Mongo compass for the documents we added, and you will see it.
//
// This _id field has an automatically generated and unique id. 
// We will use this later to uniquely refer to a document.







// If you want to find all our songs you can do
/*
Song.find()
.then(function(songs) {
  console.log("Success getting all our songs via Mongoose's find")
  songs.forEach(function(song) {
    console.log("I found a Song via Mongoose's find:")
    console.log(song)
  }) 
})
.catch(function(error) {
  console.log("Error adding", error)
});
*/

// More about find

// delete

// update

// There is a reference of all the possible calls here: https://mongoosejs.com/docs/api.html#Model


