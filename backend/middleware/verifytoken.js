const jwt = require('jsonwebtoken');
const secret_key = '50!@458**&^$r34@(#&fg&*485hgfo#$f49opj#%@$)*ndk$%gyf8ojdpfj9j'

exports.verifyjwttoken = (req,res,next) =>{
    if(!req.headers.authorization)return res.status(401).json({ message: 'Authentication failed. No token provided.',error:'no token' });
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token,secret_key , (err, decoded)=>{
        if(!token){
            return res.status(401).json({ message: 'Authentication failed. No token provided.',error:'no token' });
        }

        if(err){
            return res.status(401).json({ message: 'Authentication failed. Invalid token.',error:'token expiry' });
        }
        req.user_id = decoded.userId;
        next()
    })
}