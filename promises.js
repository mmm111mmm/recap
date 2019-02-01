// #########
// ##
// ## Let's talk about Callbacks and Promises (and connecting to Mongo as an example of the both)
// ##
// ##########

// Callbacks are functions.
// Callbacks are functions that you pass to other functions.

// They are used everywhere in javascript.

// #########
// ##
// ## Basics of callbacks
// ##
// ##########

//
// Let's see a basic example. Let's connect to MongoDB
//

MongoClient.connect(url, function(error, mongo) {
 // Mongo calls this function when have have succeeded to, or failed to, connect to the database
 //
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
})

// This is callback we pass to know when we've connected to a database (and then want to insert something)
function addToCollection(error, collection) {
  // Mongo will call this function, since it's the callback we specified above
  //
  // It will pass a error object (if there's one)
  // or `collection` if it found the collection
  //
  if(error) {
    // If there's been an error, the 'error' object will have something in it
    console.log("Error opening the database and collection", error)
  } else {
    // Now we can add to our database
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

MongoClient.connect(url, function(error, mongo) {
 // Mongo calls this function when have have succeeded to, or failed to, connect to the database
 //
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
    mongo.db("my_recap_database").collection("my_recap_collection", addToCollection1)
 } 
})

// This is callback we pass to know when we've connected to a database (and then want to insert something)
// This time we'll actually insert something into our database
function addToCollection1(error, collection) {
  // Mongo will call this function, since it's the callback we specified above
  //
  // It will pass a error object (if there's one)
  // or `collection` if it found the collection
  //
  if(error) {
    // If there's been an error, the 'error' object will have something in it
    console.log("Error opening the database and collection", error)
  } else {
    // We're now going to insert something into the database
    var country_data = {
      "country" : "scotland",
      "population" : "3000000"  
    } 
    collection.insertOne(country_data, hasInsertSucceeded)
  }
}

// This is the callback we pass to 'collection.insertOne` to know if everything succeeded or not.
function hasInsertSucceeded(error, result) {
  // This function will be run when we've inserted something.
  // Error will be something if there's been an error
  if(error) {
    console.log("Error inserting something into my_recap_collection", error)
  } else {
    console.log("Successfully added something into my_recap_collection!")
  }
}

// 
// This is increasingly getting horrible.
// And it gets even worse, the more operations we have
//
// We could use anonymous functions
// i.e. 
// collection.insertOne(country_data, function(error, result) {
//  if(error) {
//    console.log("Error inserting something into my_recap_collection", error)
//  } else {
//    console.log("Successfully added something into my_recap_collection!")
//  }
// })
//
// But it still becomes horrid to look at and code
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
// Promises give you the same functionality as callbacks, but they're nicer to write.
//
// Let's have a look at them.
//
// First, you need to know various functions in javascript give you Promises.
//
// For example, MongoClient.connect(url) return a Promise
//
// When we have a Promise, we must do things:
// * use a 'then'
// * use a 'catch'.
//
//  
