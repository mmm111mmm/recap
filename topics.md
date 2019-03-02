* includes, repeat, indexof, accessing characters

* Arthithmatic, parens

* boolean, !, <, <=, >=

* ?:

* While, continue, break

Arrays
======

* Split, Sort, Reverse

* Slice, Splice

Functional functions
====================

* forEach

* Map, Filter

* Reduce

Objects
=======

* Objects

Misc 
====

* OO with ES6

* Callbacks

* Function declaration and 'this'

* Closures, scope

* ES6

Teaching
========

Example 1
=========

* var
* string
* if, ifelse, else, ||
* function

```
function gotHouse(favouriteCharacter) {
  favouriteCharacter = favouriteCharacter.toLowerCase();
  if(favouriteCharacter == "john snow" || favouriteCharacter == "bran" ) {
    return "House Stark";
  } else if(favouriteCharacter == "cersi" || favouriteCharacter == "tyron") {
    return "House Lannister";
  } else if(favouriteCharacter == "dynaeres") {
    return "House Tygereon";
  } else {
    return "No idea, sunshine!"
  }
}

var fromHouse = gotHouse("Tyron");
console.log("Your favourite character is from: " + fromHouse);
```

Can:

* Define and assign a variable
* Make a function with a parameter
* Return a value from a function
* Call a function, with an argument
* Make an if, else if and else statement
* Create a conditional with a OR
* Compare strings
* Undercase a string
* Concatendate a string

Example 2
=========

* &&, >
* array
* array index syntax
* ++
* for
* while

```
  ...
  var i = 0;
  while(i < charactersArray.length) {
    var character = charactersArray[i];
    if(character == "john snow" || character == "bran" ) {
      stark++;
    } else if(character == "cersi" || character == "tyron") {
      lannister++;
    } else if(character == "dynaeres") {
      tygerion++;
    } else {
      console.log("I don't know that character!")
    }
    i++;
  }
  ...
```

```
function yourFavouriteHouse(charactersArray) {
  var lannister = 0;
  var stark = 0;
  var tygerion = 0;
  // find the characters you like
  for(var i = 0; i < charactersArray.length; i++) {
    var character = charactersArray[i];
    if(character == "john snow" || character == "bran" ) {
      stark++;
    } else if(character == "cersi" || character == "tyron") {
      lannister++;
    } else if(character == "dynaeres") {
      tygerion++;
    } else {
      console.log("I don't know that character!")
    }
  }
  //
  if(stark > lannister && stark  > tygerion) {
    return "stark"
  } else if(lannister > stark && lannister > tygerion) {
    return "lannister"
  } else {
    return "tygerion"
  }
}

var favouriteCharacters = ["bran", "tyron", "aeria"]
var favouriteHouse = yourFavouriteHouse(favouriteCharacters)
console.log("Your favourite house is: " + favouriteHouse)
```

Can:

* Define an array
* Use a for loop
* Access an element of an array by index
* Create a conditional with `>`
* Create a conditional with `&&`
* Use the `++` syntax
