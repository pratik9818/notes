const redis = require('redis')
 const redisclientstate  = async()=>{
    console.log('start');
    
    const redisclient = redis.createClient({
        port:3001
    })
    console.log('end',redisclient);
   await redisclient.connect()
    return redisclient
}
module.exports = redisclientstate