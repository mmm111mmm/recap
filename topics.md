* ||

* Arthithmatic, parens

* ?:

* While, for

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
* boolean, !
* if, ifelse, else, &&
* function

```
function greet(name, informal) {
  if(name == "Aaron" && informal) {
    console.log("Hiya, teacher.")
  } else if(name == "Aaron" && !informal) {
    console.log("Good morning, teacher.")    
  } else if(name == "Thor" && informal) {
    console.log("Hiya, TA")
  } else if(name == "Thor" && !informal) {
    console.log("Good morning, TA")
  } else {
    console.log("Hello, unknown stranger.")
  }
}

var firstName = "Aaron"
greet(firstName, true)
```
