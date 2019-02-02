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
// # The section deals with using Mongo without Mongoose with Javascript Promises
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

MongoClient.connect(url)
.then(function(mongo) {
  console.log("Hooray we've connected to the database")
  return mongo.db("my_recap_database").collection("my_recap_songs")
})
.then(function(collection) {
  console.log("Hooray we've connected to the collection")
  songsCollection = collection; // save it from later use
  var song_data = {
    "song_title" : "Gimme Shelter",
    "artist" : "The Rolling Stones"	
  }
  return collection.insertOne(song_data)
})
.then(function(goodResult) { // Mongo gives us a object from insertOne's promise
  console.log("We've added something to the database!")
  // This returns a promise that looks at all the data in our collection 
  // We have to say "toArray" so it gives us an array
  // And we're using the songsCollection we previously saved
  return songsCollection.find().toArray() 
})
.then(function(songsResult) { // Mongo gives us the results from find()'s promise
  console.log("Here are the results", songsResult)
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
// # The section deals with using Mongo with Mongoose
// #
// # This relates to the lecture: http://learn.ironhack.com/#/learning_unit/6481
// #
// #########

// There is another way to add, delete, update and fetch data to Mongo.
// And this is called Mongoose. It has many features.
//
// But for the moment we'll just focus on connecting to our 
// database and collection, adding something and fetching those things again.
//
// We'll talk about its advanced features, include the Schema in more default, later.
//
// We start by including mongoose via npm 'npm install mongoose'
//
// Then we must include it:
const mongoose = require('mongoose');
// Then connect to our database, and you also specify the database name
mongoose.connect('mongodb://localhost/my_recap_database');
//
// Mongoose uses something called a Model.
// This is an Javascript object that relates to a Mongo collection.
// With this object we will add, delete, update and fetch data from that collection.
//
// TODO: Talk about 
// * first param, schema to model
// * find
// * delete
// * update
// * giving different data compared to the schema
const Song = mongoose.model('my_recap_songs', { song_title: String, artist: Number, time: Number});

Song.create({ song_title: "create", artist: "create", time: 144 } )
.then(function(success) {
  console.log("Success adding with create", success)
})
.catch(function(error) {
  console.log("Error adding", error)
})
