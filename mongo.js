// Before, when we created GET and POST routes, the data disppeared after the request.
// 
// If we want to save data between requests, we need to use a database.
//
// The database we will be using is Mongo. 
//
// #########
// #
// # The section deals with using Mongo without Mongoose and without Javascript Promises
// #
// #########

// First things, first run `npm install mongodb`.
// Then require mongo to pull in its code
//
var Mongo = require('mongodb')
// Then we have to access the MonoClient object on that
var MongoClient = Mongo.MongoClient;
// Now we can begin using Mongo
//
// We need to point mongo at the location of our Mongo service.
// It's on localhost (i.e. our computer) and its default port is 27017.
//
var url = "mongodb://localhost:27017/";
// 
// Now we'll use that URL to connect
MongoClient.connect(url, function(error, mongo) {
 // The function is called if connecting to the data was true or false..
 // If there's been an error, let's print our the error
 if(error) {
   console.log("Error connecting to Mongo", error)
 } else {
   // If no error, let's use the `mongo` object.
   // We'll use to access the database.
   //
   // We're going to pass that object to a function
   // That we will define below
   useTheMongoDatabse(mongo)
 } 
})

function useTheMongoDatabse(mongo) {
  // We're now going to look at a database name
  // And a collection name.
  // If they don't exist, Mongo will create them for us.
  //
  // We will run mongo.db("my_recap_database").collection("my_recap_collection", onConnected)
  // This will eventually run the onConnected function, which we will now create.
  //
  // In this function, we will add something to our database. Let's create that now.
  //
  var onConnected = function(error, collection) {
    // Mongo will call this function. 
    if(error) {
      // If there's been an error, the 'error' object will have something in it
      console.log("Error opening the database and collection", error)
    } else {
      // Otherwise, let's use the 'collection' object to insert a random javascript object (JSON)
      // into our database. We'll define another function for this.
      addDataToDatabase(collection)
    }
  }
  // Now we've defined our callback function, let's pass 
  // it to Mongo, pointing at our database and our collection
  mongo.db("my_recap_database").collection("my_recap_collection", onConnected)
}

function addDataToDatabase(collection) {
  // We've passed in the collection we got from connecting to the database.
  var country_data = {
    "country" : "scotland",
    "population" : "3000000"	
  }
  collection.insertOne(country_data, function(error, result) {
    // This function will be run when we've inserted something.
    // Error will be something if there's been an error
    if(error) {
      console.log("Error inserting something into my_recap_collection", error)
    } else {
      console.log("Successfully added something into my_recap_collection!")
    }
  })
}

// #########
// #
// # Connecting to Mongo without Mongoose with promises
// #
// #########

MongoClient.connect(url)
.then(function(mongo) {
  console.log("Hooray we've connected to the database")
  return mongo.db("my_recap_database").collection("my_recap_collection")
})
.then(function(collection) {
  console.log("Hooray we've connected to the collection")
  var country_data = {
    "country" : "scotland",
    "population" : "3000000"	
  }
  return collection.insertOne(country_data)
})
.then(function(goodResult) {
   console.log("We've added something to the database!")
})
.catch(function(error) {
   console.log("Some kind of monogo error", error)
})
