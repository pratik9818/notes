const {z} = require('zod')
exports.credentialscheck = async (req,res,next) =>{
    console.log(req.body);
   const name = req.body.name
   console.log(typeof name);
    const nameschema = z.string()
    // const emailschema = z.string().email();
    // const passwordschema = z.string()
    nameschema.parse(name)
    next()
}