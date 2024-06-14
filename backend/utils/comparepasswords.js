const bcrypt = require('bcrypt');
const { generateToken } = require('./generatetoken');
let iscompare ;
exports.comparepasswords = (enteredPassword,hashedPasswordFromDatabase,email)=>{
    bcrypt.compare(enteredPassword, hashedPasswordFromDatabase, function(err, result) {
        if (err) {
            console.log('something went wrong please try again');
        } else if (result) {
            const token = generateToken(email)
            iscompare = result
        } else {
            // Passwords don't match, deny access
            console.log('Passwords don"t match, deny access');
            iscompare = result
        }
    });
}