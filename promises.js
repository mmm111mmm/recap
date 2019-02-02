// #########
// ##
// ## Let's talk about Callbacks and Promises - and connecting to Mongo (without Mongoose) as an example
// ##
// ##########

// Callbacks are functions.
// Callbacks are functions that you pass to other functions.
// Callbacks are functions that you pass to other functions, and that other function then later calls.

// They are used everywhere in javascript.

// They are used for long running operations.

// For example, importing all your data from linkedin may take 10 seconds.
//
// We don't want our nodejs server to stop doing everything and wait.
//
// We want to allow our server to do other things, like signing up a new user, in the meantime.
//
// And then when the linkedin import has finished, we want javascript to tell us.
//
// We want javascript to "call us back" and tell us when the data is ready.
//
// And for this we use callbacks.

// #########
// ##
// ## Basics of callbacks
// ##
// ##########

//
// Let's see a basic example. Let's connect to MongoDB
//

// Let's include the mongo db package - this means you must run `npm install mongodb`
// This gives you a javascript object
var Mongo = require("mongodb")
// On that javascript object, we want to use the MongoClient object to access mongo
var MongoClient = Mongo.MongoClient
// This url meansthe mongo is running on our computer on the standard port.
var url = "mongodb://localhost:27017/";

// Now let's connect to Mongodb
// The first parameter is the url of our database
// The second is a object that Mongo now requires so we use 
// the new style of URL (which we're using)
// The third parameter is our callback
MongoClient.connect(url, { useNewUrlParser: true }, connectionSuccess)

// Mongo calls this function when have have succeeded to, or failed to, connect to the database
function connectionSuccess(error, mongo) {
  // If there's been an error, let's print our the error
  if(error) {
    console.log("Error connecting to Mongo", error)
  } else {
    // If no error, let's use the `mongo` object, that mongo have us
    // We'll use to access the database.
    //
    // We're going to access the my_recap_database database, and the my_recap_collection collection.
    // If they don't exist, Mongo will create them for us.
    // 
    // And we're going to use another callback function, addToCollection function, which we
    // will define later.
     mongo.db("my_recap_database").collection("my_recap_collection", addToCollection)
  } 
}

// This is callback we pass to know when we've connected to a database (and then want to insert something)
function addToCollection(error, collection) {
  // Mongo will pass a error object (if there's one)
  // or `collection` if it found the collection
  //
  if(error) {
    // If there's been an error, the 'error' object will have something in it
    console.log("Error opening the database and collection", error)
  } else {
    // Now we can do something with our collection object
  }
}

// 
// That's not too horrible.
//

// #########
// ##
// ## But increasingly our callbacks call callbacks
// ##
// ##########

MongoClient.connect(url, { useNewUrlParser: true }, connectionSuccess1);

function connectionSuccess1(error, mongo) {
  if(error) {
    console.log("Error connecting to Mongo", error)
  } else {
    mongo.db("my_recap_database").collection("my_recap_collection", addToCollection1)
  } 
}

function addToCollection1(error, collection) {
  if(error) {
    console.log("Error opening the database and collection", error)
  } else {
    // We're now going to insert something into the database
    var country_data = {
      "country" : "scotland",
      "population" : "3000000"  
    } 
    // We add the data and pass in another callback, which is called when we've
    // finished inserting something into the database.
    collection.insertOne(country_data, hasInsertSucceeded)
  }
}

// This is the callback we pass to 'collection.insertOne` to know if everything succeeded or not.
function hasInsertSucceeded(error, result) {
  if(error) {
    console.log("Error inserting something into my_recap_collection", error)
  } else {
    console.log("Successfully added something into my_recap_collection with callbacks!\n")
  }
}

// 
// This is increasingly getting horrible.
// And it gets even worse, the more operations we have
//
// We could do the same with with anonymous functions:
//

MongoClient.connect(url, { useNewUrlParser: true }, function(error, mongo) {
  if(error) {
    console.log("Error connecting to Mongo", error)
  } else {
    mongo.db("my_recap_database").collection("my_recap_collection", function (error, collection) {
      if(error) {
        console.log("Error opening the database and collection", error)
      } else {
        var country_data = {
          "country" : "scotland",
          "population" : "3000000"  
        } 
        collection.insertOne(country_data, function(error, result) {
          if(error) {
            console.log("Error inserting something into my_recap_collection", error)
          } else {
            console.log("Successfully added something into my_recap_collection with callbacks and anonymous functions!\n")
          }
        })
      }
    })
  }
})


//
// But let's face it: it's still pretty horrible. Arguably, even worse.
// 
// The term for this in the javascript community is Callback Hell: callbacks calling callbacks calling callbacks calling callbacks...
//

// #########
// ##
// ## Let's talk about Promises
// ##
// ##########

//
// Javascript developers hated writing code like the above. 
// So they created Promises.
//
// Promises give you the same functionality as callbacks, but they're nicer to write, read and understand.
//
// They are used throughout javascript. Not just in databases.
//
// Let's have a look at them.
//
// First, you need to know some functions in javascript give you Promises.
//
// For example, MongoClient.connect(url) return a Promise 
// (Note that before we were running MongoClient.connection(url, callback) -- and that didn't give you a promise
// because you were using a callback)
//
// Not everything in Javascript returns a Promise. But the developers at MongoDB developed
// their code to use Promises.
//
// When we have a Promise, we must do things:
// * use a 'then'
// * use a 'catch'.
//
// The 'then' part is run when everything has been successful.
// The 'catch' part is run when there's been an error.

MongoClient.connect(url, { useNewUrlParser: true })
.then(function(mongo) {
  console.log("In promise: Hooray we've connected to the database")
})
.catch(function(error) {
   console.log("In promise: Some kind of monogo error", error)
})

// Note! The code directly below the promise is immediately be called.
// It's only later that either our 'then' or 'catch' functions will be called.

// So we get our Promise `MongoClient.connect(url)`.
//
// Then we call .then()
// .then() has one argument, a function.
// This function is run when everything has been successful
//
// After our then, we call .catch()
// .catch() has one argument, a function.
// This function is run if there was an error.
//
// The above promise is the equivalent of this with callbacks:
//
/*
MongoClient.connect(url, { useNewUrlParser: true }, function (error, mongo) {
  if(error) {
    console.log("Error connecting to Mongo", error)
  } else {
    console.log("In promise: Hooray we've connected to the database")
  } 
}
*/
//
// This is nice, but the nicest thing in Promises is the ability to chain them.
//
// We can make the `then` function in a Promise, itself return a Promise.
// Then you can add another .then call for that new Promise:
//

MongoClient.connect(url, { useNewUrlParser: true })
.then(function(mongo) {
  console.log("In promise: Hooray we've connected to the database")
  // The below return a Promise, because the MongoDB developers decided to use Promises
  return mongo.db("my_recap_database").collection("my_recap_collection")
})
.then(function(collection) {
  console.log("In promise: Hooray we've connected to the collection.\n")
})
.catch(function(error) {
   console.log("In promise: Some kind of monogo error", error)
})
//
// Note: We have only one .catch.
// This will be called if either of the Promises error.
//
// We can 'chain' lots of Promises.
// Now we'll chain promises to conenct to mongo, access the collection, 
// add to the collection and print a success statement:

MongoClient.connect(url, { useNewUrlParser: true })
.then(function(mongo) {
  console.log("In promise: Hooray we've connected to the database")
  return mongo.db("my_recap_database").collection("my_recap_collection")
})
.then(function(collection) {
  console.log("In promise: Hooray we've connected to the collection")
  var country_data = {
    "country" : "scotland",
    "population" : "3000000"
  }
  // The below return a Promise
  return collection.insertOne(country_data)
})
.then(function(goodResult) {
   console.log("In promise: We've added something to the database!")
})
.catch(function(error) {
   console.log("In promise: Some kind of monogo error", error)
})
