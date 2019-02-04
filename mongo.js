// #################
// #
// # This document recaps "Mongoose | Introduction"
// # http://learn.ironhack.com/#/learning_unit/6481
//
// # And talks a little about Mongo without Mongoose.
// #
// #################

// Before, when we created GET and POST routes with express, the data disppeared after the request.
// 
// If we want to save data between requests, like saying a new user or facebook post for example, 
// we need to use a database.
//
// The database we will be using is Mongo. 
//
// We normally use Mongo from within an express route. But we don't have to.
//
// In this file, we'll be using Mongo and Mongoose without expressjs.
//
// #########
// #
// # The section deals with using Mongo without Mongoose and with Javascript Promises
// #
// #########

// We previously learn about connecting to Mongo with Promises.
// If this is new to you, read the promises.js file in this repository.

// We're going to write some javascript that adds a song to our new Mongo collection.

var Mongo = require("mongodb")
var MongoClient = Mongo.MongoClient
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useNewUrlParser: true })
.then(function(mongo) {
  //console.log("Hooray we've connected to the database")
  return mongo.db("my_recap_database").collection("my_recap_songs")
})
.then(function(collection) {
  //console.log("Hooray we've connected to the collection")
  var song_data = {
    "song_title" : "Gimme Shelter",
    "artist" : "The Rolling Stones"	
  }
  // We're going to return two promises.
  // One to add the data, and the next to find
  // all the data after the add
  
  // We have to say "toArray" in our find Promise, so it gives us an array.
  // (When we use Mongoose we won't have to do this)

  return Promise.all([
    collection.insertOne(song_data),
    collection.find().toArray()
  ])
})
.then(function(insertAndFindResult) {
  //console.log("We got the results", insertAndFindResult[1])
  // We could print out insertAndFindResult[1] to see them all
})
.catch(function(results) {
   console.log("Some kind of monogo error", results)
})

// You can see we're adding something to Mongo. 
// To be precise, we're adding:
/*
{
  "song_title" : "Gimme Shelter",
  "artist" : "The Rolling Stones"	
}
*/

// This works well, and it's pure Mongo.
//
// But we're going to use something called Mongoose



// #########
// #
// # The section deals with using Mongo with Mongoose.
// # It only deals with creating new documents. We'll deal
// # with updating, deleting and find documents in the next file.
// #
// #########

// There is another way to add, delete, update and fetch data from Mongo.
// And this is called Mongoose. It has many features.
//
// But for the moment we'll just focus on connecting to our 
// database and collection adding documents to that collection.
//
// We'll talk about its advanced features, including the Schema in more default, later.
//
// We start by including Mongoose via npm 'npm install mongoose'
//
// Then we must include it:
const mongoose = require('mongoose');
// We will now connect to our database, and we also specify the database name
// We say { useNewUrlParser: true } to tell Mongo we're using the new URL parser 
// (which we are).
mongoose.connect('mongodb://localhost/my_recap_database', { useNewUrlParser: true });
//
// Mongoose uses something called a Model.
// This is an Javascript object that relates to a Mongo collection.
// With this object we will add, delete, update and fetch data from our Mongo collection.
//
// We make a Model with `mongoose.model()`.
// * The first parameter is the Mongo collection name
// * The second line is what we call a schema.
//
// A Schema tells Mongoose what our data  will look like.
//
// For example, "it will have a field called song_title, and that will be a string", etc
//
// The scheme will look like this:
// {
//   fieldName: fieldType,
//   another:   fieldType,
// }
//
// And the fieldType can be String, Number, Array, Object, Boolean, etc.
// We will talk about this in more detail later.
//
const songSchema = { song_title: String, artist: String };
const Song = mongoose.model('my_recap_songs', songSchema);

// Now we've create a Mongoose model, we can start using the `Song` object.
//
// We can create new song by saying `Song.create` and as its argument
// we pass a javascript object that confirms to the Schema we created.
//
// In other words, the object will have the same names as in our schema, and
// the same type of data.

Song.create({ song_title: "Rocky Raccoon", artist: "The Beatles"})
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

// You can also add a document with `new`
//
// We already have a javascript object called `Song` which we
// created using `mongoose.model('my_recap_songs', songSchema);`
//
// We can then do `new Song({ song_title: "My Favorite Things", artist: "John Coltrane"})
// And this gives me a new object.
// And we run the function .save() on that to save the document.
//

var myNewSong = new Song({ song_title: "My Favorite Things", artist: "John Coltrane"})

myNewSong.save()
.then(function(saved) {
  console.log("I saved a Mongo document using Mongoose's `new` and save()")
})
.catch(function(error) {
  console.log("Error adding a new song.")
})

// Let's talk about unique ids.

// For each document ( i.e. the song) we entered, Mongo did something automatically for us
// Mongo gave us an _id field. 
// 
// Look into Mongo compass for the documents we added, and you will see it.
//
// This _id field has an automatically generated and unique id. 
// We will use this later to uniquely refer to a document.



// #########
// #
// # The section deals with using Mongoose's connection methods.
// #
// #########

// We have connected to Mongo using Mongoose. This is an example of an 'event'.
//
// We can make Mongoose tell us when these events happen.
// And we can call a function when these events happen.s
//
mongoose.connection.on('connected', function() {  
  console.log('Mongoose connection listener: Mongoose connection open');
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {  
  console.log('Mongoose connection listener: Mongoose connection disconnected'); 
});

// If the connection throws an error
// For example, if Mongo isn't running on this computer.
//
// This will be run in addition to any .catch statements
// that you have on your Promises
mongoose.connection.on('error', function(err) {  
  console.log('Mongoose connection listener: Mongoose connection error: \n' + err);
}); 

// This is how we tell Mongoose to close its
// connection to the database.
//
//mongoose.connection.close(function() { 
//  console.log('Mongoose connection closed!'); 
//});
//
// NOTE: If we close the connection before all our promises are finished, 
// an error will occur.




// Next we'll deal with updating, deleting and finding documents with Mongoose.
//
// And we'll do it from within a ExpressJS server that uses Handlebars.
