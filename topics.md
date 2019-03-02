* &&

* Arthithmatic, parens

* ?:

* boolean, !

* While, for, continue, break

Arrays
======

* Arrays

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
  favouriteCharacter = favouriteCharacter.toLowerCase()
  if(favouriteCharacter == "john snow" || favouriteCharacter == "bran" ) {
    return "House Stark"
  } else if(favouriteCharacter == "cersi" || favouriteCharacter == "tyron") {
    return "House Lannister"
  } else if(favouriteCharacter == "dynaeres") {
    return "House Tygereon"
  } else {
    return "No idea, sunshine!"
  }
}

var fromHouse = gotHouse("Tyron")
console.log("Your favourite character is from: " + fromHouse)
```
