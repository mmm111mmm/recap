// Before, when we created GET and POST routes, the data disppeared after the request.
// 
// If we want to save data between requests, we need to use a database.
//
// The database we will be using is Mongo. 
//
// #########
// #
// # The section deals with using Mongo without Mongoose with Javascript Promises
// #
// #########

MongoClient.connect(url)
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
  return collection.insertOne(country_data)
})
.then(function(goodResult) {
   console.log("In promise: We've added something to the database!")
})
.catch(function(error) {
   console.log("In promise: Some kind of monogo error", error)
})
