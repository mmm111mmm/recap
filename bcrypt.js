let HASHED_PASSWORD = ""

const bcrypt = require('bcrypt');
const saltRounds = 10;

// ###### Image the user is now registering with you
// ###### And they've given you a password

const MY_REG_PASSWORD = "password"

// You now encrypt this password
bcrypt.hash("password", saltRounds, function(err, hash) {
  console.log("hash of password:", hash)
  // You would now store this password in your database
  HASHED_PASSWORD = hash;
});

// Let's just wait 2 seconds so we're sure the password hashing has finished
setTimeout(login, 1000)

function login() {
  // ###### Later on, they login
  // ###### And they give you a password

  // Image you have now got the hashed password from your database

  const MY_LOGIN_PASSWORD = "password"
  // Let's now compare the plain login password to the hashed password from the database
  bcrypt.compare(MY_LOGIN_PASSWORD, HASHED_PASSWORD, function(err, res) {
    console.log("the login user name is correct? ", res)
  });
}

