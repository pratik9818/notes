const bcrypt = require('bcryptjs');
const { passwordvalidation } = require('../utils/validator');
exports.passwordencrypt = async (req,res,next)=>{
    try {
        const password = req.body.password;
        const ispasswordvalidate = passwordvalidation(password)
        if(!ispasswordvalidate){
              return next({statuscode:400, message:'fill proper password',error:true})
        }
        const saltround = 10;
        const salt = await bcrypt.genSalt(saltround);
        const hash = await bcrypt.hash(password, salt);
        req.body.password = hash;
        next();
    } catch (error) {
        // Handle errors
        console.error('Error encrypting password:', error);
        res.status(500).send('Internal Server Error');
    }
}