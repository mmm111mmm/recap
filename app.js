// This file gives you examples for five lessons that relate to Node.js, express and handlebars.
// We do not deal with mongo or mongoose in this file.

// This recaps the lessons:

// 0. Intro to express: https://trello.com/c/86ZKDbJU/84-express-introduction 
// 1. Express and handlebars (Express Dynamic views): https://trello.com/c/MYCj8lFg/88-express-dynamic-views
// 2. Handlebars and layouts (Express | Layouts): https://trello.com/c/YvyNe5JY/86-express-layouts-but-no-partials-%F0%9F%87%A9%F0%9F%87%AA
// 3. GET methods: https://trello.com/c/VUcIMbBn/93-express-get-methods-route-params-query-string
// 4. POST methods: https://trello.com/c/YtdkOi8T/99-express-post-method-request-body
// 5. And how to redirect to another webpage or website
// 5. And how to use the expressjs Router object

// You will run this file by typing: node app.js
// You needs npm modules so type 'npm install express hbs body-parser' -- but we talk about this in the comments.

// #########
// # Everything in this section relates to the intro to node lesson
// # https://trello.com/c/86ZKDbJU/84-express-introduction
// #########

// YOU MUST ENSURE YOU DO "npm install express" in this directory
const express = require('express');
// We now initalise express in the variable 'app'
const app = express();

// This creates a route - it will live at http://localhost:3000/send_a_string
app.get('/send_a_string', function (request, response, next) { 
  // request contains the the user's (i.e client's) data (e.g. the search term the user gives google.com, for example)
  // 
  // response will be used to talk back to the user (i.e. client)
  //
  // we're going to ignore next, for the moment.

  // The below send some HTML to the client
  // Note the function is called 'send' and its argument is a string
  response.send(`
    <html>
      <head></head>
      <body>
        <h1>Welcome Ironhacker. :)</h1>
      </body>
    </html>
  `);
});


// This creates another route - it will live at http://localhost:3000/send_a_file
//
// This time we will not output the HTML directly (i.e. not with response.send) 
app.get('/send_a_file', function (request, response, next) { 
  // This time we don't use `response.send`. Instead we use response.sendFile()
  // 
  // With response.sendFile(), we specify the location of a file. Thie file lives with views/ourpage.html
  // But we must specify the 'full' path, i.e. /Users/aaron/ironhack/thisproject/views/ourpage.html
  // We use the special variable __dirname and then do + /views/ourpage.html to do that.
  //
  // This, then, means we need a views directory, and a ourpage.html file in that directory.
  response.sendFile(__dirname + "/views/ourpage.html");
});




// ##################
// ## Everything in this section relates to dynamic views, i.e. handlebars
// ## https://trello.com/c/MYCj8lFg/88-express-dynamic-views
// ##################
//
// Previously we made a express route that prints out a file
//
// But we cannot pass any javascript objects to /views/ourpage.html
//
// We can, however, use something called handlebars to do so.
//
// You must ensure you do "npm install hbs" in this directory (hbs means "handlebars")
// 
// For handlebars, we need to set the views location on our express app object
app.set('views', __dirname + '/views');
// Then we need to set our view engine to be handlebars (hbs)
app.set('view engine', 'hbs');
// 
// 
// This creates a route - it will live at http://localhost:3000/handlebars
// In this route, we will use handlebars
app.get('/handlebars', function(request, response, next) { 
  // This time we use 'response.render' because we want to render a handlebars file
  // NOTE: we no longer specify the '/views' directory. This is because we did it above
  // with app.set('views', __dirname + '/views');
  //
  // This means we need a file called 'views/ourhandlebarspage.hbs'
  // This file will be normal HTML (for the moment)
  // Note that we don't need the .hbs extension with response.render but our file on our computer needs it
  response.render('ourhandlebarspage');
});


// We said we will send javascript objects to a handlebars page.
// We're not doing that now, but we will with our next route.

// This creates a route - it will live at http://localhost:3000/handlebars_with_data
// In this route, we will use handlebars to pass a javascript object to our hbs file
app.get('/handlebars_with_data', function(request, response, next) { 
  // We are making a normal javascript object literal
  // It has two field names, name and drink.
  var ourobject = {
    name: "Aaron",
    drink: "whiskey"
  }
  // Now we are passing this object to our new hbs file
  // Note: This means we must create a views/ourhandlebarspage_withdata.hbs file
  response.render('ourhandlebarspage_withdata', ourobject);
});
// 
// In our views/ourhandlebarspage_withdata.hbs file we can look at the object we 
// passed to the file. We will look at it below:
/*
<h1> I am handlebars with data </h1>
  
<div>My name is {{ name }}</div>
<div>My drink is {{ drink }}</div>
*/
//
// In this file I use the strange syntax {{ }}
// Inside those, I refer the the fields, name and drink, that I
// passed to response.render.
//
// You can do many things with this syntax, such as iterating over arrays
// It's difficult to remember all of this. So use a reference, such as 
// http://materials.ironhack.com/s/Sy9QA3GTNV7#built-in-helpers 



// #########
// # Everything in this section relates to using the layout.hbs file
// # https://trello.com/c/YvyNe5JY/86-express-layouts-but-no-partials-%F0%9F%87%A9%F0%9F%87%AA
// #########

// Let's imagine you want copyright 2019 on the bottom of all of your pages.
// 
// Handlebars allows you to do this easily.
//
// If you include a layout.hbs file in your views directory (views/ normally)
// then handlebars will automatically use this file when it renders any page.
//
// Here's an example of my layout.hbs file
/*
<html>
  <head>
  </head>
  <body>
    {{{ body }}}
    <hr>
    Copyright 2019
  </body>
</html>
*/
//
// This file is a little strange. We have our copyright information.
// But we also have {{{ body }}}. That is, THREE curly brackets.
//
// The content of {{{ body }} will be the page we specified in our route.
//
// Let's look at our previous route, handlebars_with_data.
//
/*
app.get('/handlebars_with_data', (request, response, next) => { 
  var ourobject = {
    name: "Aaron",
    drink: "whiskey"
  }
  response.render('ourhandlebarspage_withdata', ourobject);
});
*/
//
// In this example, the content of body will be whatever relates to response.render('ourhandlebarspage_withdata')
// i.e. the content of 'ourhandlebarspage_withdata.hbs'.




// #####################
// ## This section relates to: Passing data to our routes (with GET routes)
// ## https://trello.com/c/VUcIMbBn/93-express-get-methods-route-params-query-string
// #####################
// 
// We previously creates lots of routes
// 
// But we want to allow the user (i.e. client) to give us some information.
// For example, a user wants to give spotify's servers an artist to search for
//
// We can do this with things called 'query parameters'. 
//
// The user sends us query parameters like this: http://localhost:3000/a_get_route?food=greek&drink=ouzo
//
// The client sends the query parameters by putting the `?` symbol after the website url.
// 
// Then the user gives a parameter name (i.e. food), then =, then the value (i.e. greek).
// And you separate more than one parameter with the `&` sign.
//
// Let's now get these query parameters in our route.
//
// This creates a route - it will live at http://localhost:3000/a_get_route?food=greek&drink=ouzo
// We will get query parameters in this route
app.get('/a_get_route', function(request, response, next) { 
  // Remember the 'request' object contains the information the user wants to give us
  //
  // And remember we want to get that information from 'query' parameters
  //
  // So we use request.query and then we specify name of the query parameter.
  //
  // And if we look above, we passed two parameter: one called food and another called drink.
  var thefood = request.query.food
  var thedrink = request.query.drink
  // Let's console log these to make sure we have them.
  // We will need to look in the nodejs terminal to see these
  console.log("the query parameter are: ", thefood, " and ", thedrink)
  // Remember we can only test this when the URL has the query parameters, i.e.
  // http://localhost:3000/a_get_route?food=greek&drink=ouzo
  //
  // With these new query parameters, we'd normally do something with them.
  // For example, we might render a difference page, or send different data
  // to the handlebars page. But for now we'll just send them to our handlebars file.
  let our_data = {
    food: thefood,
    drink: thedrink
  }
  console.log(our_data)
  // As a simple example, in our views/our_get_route_with_data.hbs file 
  // we simply print our the information in our_data.	
  response.render('our_get_route_with_data', our_data);
});

// There's another way to get data from a GET request
// It's called using URL path segments or URL parameters
//
// You will call the URL like this:
// http://localhost:3000/a_get_route_with_url_segments/greek/ouzo
//
// If we were using URL query parameters it would be: ...?food=greek&drink=ouzo
//
// URL segments simply give prettier URLs. Compare
// http://localhost:3000/a_get_route_with_url_segments/greek/ouzo
// to
// http://localhost:3000/with_query_params?food=greek&drink=ouzo
// 
// They give you the same functionality, but the URLs look different.
//
// This creates a route - it will live at http://localhost:3000/a_get_route_with_url_segments/greek/ouzo
app.get('/a_get_route_with_url_segments/:food/:drink', function(request, response, next) {
  // Note the `:` in the route.
  // This only indicates to express this is a URL segment.
  // You do NOT put this in the web browser address bar.
  //
  // So to get these url segments you use `request.params`.
  // Then use use the name after that `:` in your route.
  var thefood = request.params.food
  var thedrink = request.params.drink
  // Let's console log these to make sure we have them correctly.
  // We will need to look in the terminal to see these
  console.log("the url path segments are: ", thefood, " and ", thedrink)

  // With these new parameters, we'd normally do something with them.
  // For example, we might render a difference page, or send different data
  // to the handlebars page. But for now we'll just send them to our handlebars file.
  let our_data = {
    food: thefood,
    drink: thedrink
  }
  // As a simple example, in our views/our_get_route_with_data.hbs file 
  // we simply print our the information in our_data.	
  response.render('our_get_route_with_data', our_data);
})





// #####################
// ## This section relates to: Using POST routes 
// ## https://trello.com/c/YtdkOi8T/99-express-post-method-request-body 
// #####################

// So far we've been using GET routes.
// You can see it is a GET route because we have typed app.get("/routename" ...)
//
// There is another type of route. This is called a POST route.
// 
// You can use either GET or POST. By convention, people use POST
// to save things, like sending information about a new user. 
//
// There are two main things you need to know about POST requests:
// * You do NOT use query parameter  (i.e. you can't do http://localhost:3000/a_get_route?food=greek&drink=ouzo) to pass information to a POST route
// * You submit information to a POST route using a HTML form.
//
// When I say HTML form I mean this:
/*
<form action="/a_post_route" method="post">
  <input name="food">
  <br>
  <input name="drink">
  <br>
  <button type="submit">press me<button>
<form>
*/
//
// the 'action' attribute on the form tag points to our route name (which we haven't created yet).
// the 'method' attribute on the form tag says we're going to use a POST request
// the 'name' attribute on the input tags define the name of the parameter we will send to our post route
// the button (with type="submit") will send our data to the post route (which we haven't created yet)
//
// We are now going to save this file as 'a_html_form.hbs' in our views/ directory.
//
// Although we are going to get a POST request eventually, 
// we are going to show our HTML form using a GET route.
// 
// This creates a route - it will live at http://localhost:3000/show_the_form
app.get("/show_the_form", function(request, response, next) {
  response.render("a_html_form")
})
//
// Once we go to this route using http://localhost:3000/show_the_form
// it will show us our HTML form.
//
// Now we can fill in our HTML form on that page.
// 
// Remember or HTML form is point at /a_post_route (using <form action="/a_post_route">) 
// So once we press the button on our form, we will go to the route /a_post_route
//
// So let's create that route.
//
// But first, please remember that we cannot use query parameters with POST routes.
// In fact, getting data from post routes is a little more complex.
// It's so complex that we need another npm module to do it.
// The name of the npm module is 'body-parser'. So let's type 'npm install body-parser'
//
// After install the npm module, we need to require the module
const bodyParser = require('body-parser');
// And we need to tell express to use that.
// Please ignore the 'urlencoded' part now, but do type it in. 
// We will explain it later on.
app.use(bodyParser.urlencoded({ extended: true }));
//
// Now let's finally create our POST route
//
// Note that instead of saying `app.get`, we now say `app.post`. This makes it a post route
// This creates a route - it will live at http://localhost:3000/a_post_route
// And our HTML form will take us there.
app.post("/a_post_route", function(request, response, next) {
  // Now in our route (because we included the bodyParser) we can simply look at the information
  // that the HTML form gave us using
  var information = request.body
  console.log(information)
  // For example, using the filled in HTML form, it could be like this
  //  
  // { food: 'mozerella', drink: 'whiskey' }
  //
  // With this new POST data, we'd normally do something with it.
  // For example, we might render a difference page, or send different data
  // to the handlebars page. But for now we'll just send them to our handlebars file.
  let our_data = {
    food: information.food,
    drink: information.drink
   }
  // As a simple example, in our views/our_get_route_with_data.hbs file 
  // we simply print our the information in our_data.	
  response.render('our_post_route_with_data', our_data);
})

// Let's talk about something different.
// Let's talk about express middleware.
//
// What is it?  It's something that lives in the middle.
//
// The middleware is a function that is called before our routes.
// At least, our routes that are defined after we define our middleware.
// 
// Middleware does things like: Check you are logged in, 
// make a log of all the user requests into your app, etc.
//
// Let's look at an example:
//
//app.use(function(request, response, next) {
//  console.log("I am called before subsequent requests")
//  next();
//})
//
// Let's look at the `next` variable.
// The `next` variable is a function.
// And so we can call `next()`
// And this means now go the route the user originally requested.
//
// For example if you type in http://localhost:3000/if_firefox (which we'll define below)
// The first thing that would happen is our middlware function above would be called.
// Then in our middleware function, we'd call `next()`.
// And then we'd go to the if_firefox route.
//
// Let's make some real middleware.
// Our middleware will look at the user's web browser.
// If they're using firefox we'll add a property to the request object
// Then the normal route that the user called will have the property on the request object
//
// NOTE: This is obviously a stupid example.
// Normally you'd do something like logging, user authorisation, etc
app.use(function(request, response, next) {
  // Every request has headers
  // These are little bits of information like information about the web browser you are using
  // To find out what browser the user is using we can look at the "user-agent"
  var userAgent = request.headers["user-agent"] 
  // console.log(userAgent) -- uncomment this if you want to see the entire "user-agent"
  // We are now going to look if your user-agent has the text "Firefox" in it.
  var isFirefox = userAgent.includes("Firefox")
  if(isFirefox) {
    // We're adding a new property to our request object
    // That is, usingFirefox didn't exist, but now it does.
    // And means the request object in the route will have this property
    request.usingFirefox = true
  } else {
    request.usingFirefox = false
  }
  // Now let's continue with the normal route (whatever the user wanted to go to originally)
  next(); 
})

// Now we've registered our middleware, all the routes that are defined AFTER we do `app.use`
// will use this middleware.
//
// If you want ALL your routes to use your middleware, put the `app.use` call at the top of your file.
//
// So let's now define a new GET route that uses this middleware.
//

// This creates a route - it will live at http://localhost:3000/if_firefox
app.get("/if_firefox", function(request, response, next) {
  // We're not using response.render() in this example.
  // That's because this is simple example, and all I want to do
  // is print text to the browser.
  // And I want to access the property we defined in our middleware
  response.send("Are you using firefox? " + request.usingFirefox)
})

// Here's something small and extra
//
// Sometimes we want to redirect the user to another webpage
// 
// For example, perhaps we detect they're not logged in 
// (Something we'll learn later)
// Then want to redirect them to another website if they're not logged in
//
// This is easy to do. We just say response.redirect("https://wikipedia.org")
// The page we want to redirect to is the parameter.

// This creates a route - it will live at http://localhost:3000/take_me_to_wikipedia
app.get("/take_me_to_wikipedia", function(request, response, next) {
  // Obviously this is a silly example.
  // Normally, you'd redirect a user if you detect they're not logged in, for example.
  response.redirect("https://wikipedia.org")
})



// This starts our server on port 3000
app.listen(3000, function() {
  console.log('My app listening on port 3000!')
});
