// You will run this file by typing: node app.js
// You needs npm modules so tyoe 'npm install express hbs body-parser' -- but we talk about this in the comments.

// #########
// # Everything in this section relates to the intro to node lesson
// # https://trello.com/c/86ZKDbJU/84-express-introduction
// #########

// YOU MUST ENSURE YOU DO "npm install express" in this directory
const express = require('express');
// We now initalise express in the variable 'app'
const app = express();

// This creates a route - it will live at http://localhost:3000/example1
app.get('/example1', (request, response, next) => { 
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


// This creates another route - it will live at http://localhost:3000/example2
//
// This time we will not output the HTML directly (i.e. not with response.send) 
app.get('/example2', (request, response, next) => { 
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
// Previous we made a express route that prints out a file
//
// But we cannot pass any javascript objects to /views/ourpage.html
//
// We cannot, however, use something called handlebars to do so.
//
// So must ensure you do "npm install hbs" in this directory (hbs means "handlebars")
// 
// For handlebars, we need to set the views location on our express app object
app.set('views', __dirname + '/views');
// Then we need to set our view engine to be handlebars (hbs)
app.set('view engine', 'hbs');
// 
// 
// This creates a route - it will live at http://localhost:3000/example3
// In this route, we will use handlebars
app.get('/example3', (request, response, next) => { 
  // This time we use 'response.render' because we want to render a handlebars file
  // NOTE: we no longer specify the '/views' directory. This is because we did it above
  // with app.set('views', __dirname + '/views');
	//
  // This means we need a file called 'views/ourhandlebarspage.hbs'
  // This file will be normal HTML (for the moment)
  // Note that we don't need the .hbs extension with response.render but our file on our computer needs it
  response.render('ourhandlebarspage');
});


// We said we use handle bars to give javascript objects to handlebars.
// We're not doing that now, but we will with our next route.

// This creates a route - it will live at http://localhost:3000/example4
// In this route, we will use handlebars to pass a javascript object to our hbs file
app.get('/example4', (request, response, next) => { 
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
// massed to response.render.
//
// You can do many things with this syntax, such as iterating over arrays
// It's difficult to remember all of this. So use a reference, such as 
// http://materials.ironhack.com/s/Sy9QA3GTNV7#built-in-helpers 



// #########
// # Everything in this section relates to using the layout.hbs file
// # https://trello.com/c/YvyNe5JY/86-express-layouts-but-no-partials-%F0%9F%87%A9%F0%9F%87%AA
// #########

// Let's image your want copyright 2019 on the bottom of all of your pages.
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
// Let's look at our previous route, example4.
//
/*
app.get('/example4', (request, response, next) => { 
	var ourobject = {
		name: "Aaron",
		drink: "whiskey"
  }
  response.render('ourhandlebarspage_withdata', ourobject);
});
*/
//
// In this exampel, the content of body will be what relates to reponse.render('ourhandlebarspage_withdata')
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
// The user sends us query parameters like this: http://localhost:3000/example5?food=greek&drink=ouzo
//
// The client sends the query parameters by putting the `?` symbol after the website url.
// 
// Then the user gives a parameter name (i.e. food), then =, then the value (i.e. greek).
// And your separate more than one parameter with the `&` sign.
//
// Let's now get these query parameters in our route.
//
// This creates a route - it will live at http://localhost:3000/example5
// We will get query parameters in this route
app.get('/example5', (request, response, next) => { 
	// Remember the 'request' object contains the information the user wants to give us
	//
  // And remember we want to get that information from 'query' parameters
  //
  // So we use request.query and then we specify name of the query parameter.
  //
  // And if we look above, we passed two parameter: one called firstparameter and another called secondparameter
  var thefood = request.query.food
  var thedrink = request.query.drink
	// Let's console log these to make sure we have them correctly.
  // We will need to look in the terminal to see these
	console.log("the query parameter are: ", thefood, " and ", thedrink)
	// Remember we can only test this when the URL has the query parameters, i.e.
  // http://localhost:3000/example5?food=greek&drink=ouzo
	//
  // With these new query parameters, we'd normally do something with them.
  // For example, we might render a difference page, or send different data
  // to the handlebars page. But for now we'll leave them.
  //
  // All we're doing in this lesson is showing how to get query parameters.
  response.render('ourhandlebarspage' );
});


// TODO: http://materials.ironhack.com/s/HJyNA2MT4EQ#route-params



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
// * You do NOT use query parameter  (i.e. you can't do http://localhost:3000/example5?food=greek&drink=ouzo) to pass information to a POST route
// * You submit information to a POST route using a HTML form.
//
// When I say HTML form I mean this:
/*
	<form action="/example6post" method="post">
		<input name="food">
    <br>
		<input name="drink">
    <br>
		<button type="submit">press me<button>
  <form>
*/
//
// the 'action' attribute on the form tag points to our route name (which we haven't created yet).
// the 'name' attribute on the input tags define the name of the parameter we will send to our post route
// the button (with type="submit") will send our data to the post route (which we haven't created yet)
//
// We are now going to save this file as 'example6form.hbs' in our views/ directory.
//
// Although we are going to get a POST request eventually, 
// we are going to show our HTML form using a GET route.
// 
// This creates a route - it will live at http://localhost:3000/example6
app.get("/example6", function(request, response, next) {
	response.render("example6form")
})
//
// Once we go to this route using http://localhost:3000/example6
// it will show us our HTML form.
//
// Now we can fill in our HTML form on that page.
// 
// Remember or HTML form is point at /example6post (using <form action="/example6post">) 
// So once we press the button on our form, we will go to the route /example6post
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
// And we need to sell express to use that.
// Please ignore the 'urlencoded' part now, but do type it in. 
// We will explain it later on.
app.use(bodyParser.urlencoded({ extended: true }));
//
// Now let's finally create our POST route
//
// Note that instead of saying `app.get`, we now say `app.post`. This makes it a post route
// This creates a route - it will live at http://localhost:3000/example6post
// And our HTML form will take us there.
app.post("/example6post", function(request, response, next) {
 // Now in our route (because we included the bodyParser) we can simply look at the information
 // that the HTML form gave us using
 var information = request.body
 console.log(information)
 // For example, using the filled in HTML form, it could be like this
 /*
	* { food: 'mozerella', drink: 'whiskey' }
 */
 // With this new post body parameters, we'd normally do something with them.
 // For example, we might save a new user. Then render a page that says
 // user save.
 //
 // But in this lesson, all we're doing in this lesson is showing how to use body post parameters.
 response.render('ourhandlebarspage');
})

// TODO: Talk about middleware







// This starts our server on port 3000
// We must put this at the bottom of our file
app.listen(3000, () => {
  console.log('My first app listening on port 3000!')
});
