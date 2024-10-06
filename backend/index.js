
 const express = require('express')
 const userRoutes = require('./api/routes/routes.js')
 const bodyParser = require('body-parser');
 const cluster = require('cluster')
 const os = require('os')
 const app = express()
const {createClient} = require('redis')
const {RedisStore} = require('rate-limit-redis')
const rateLimit = require('express-rate-limit')
const port = 3001
const cors = require('cors');
app.use(cors({
    origin: '*',
}))
app.use(bodyParser.urlencoded({ extended: true }));

const cpucors = os.cpus().length

if(cluster.isPrimary){
    console.log(`Primary ${process.pid} is running`);
    for (let index = 0; index < cpucors; index++) {
    cluster.fork()

}
    cluster.on('exit', (worker , code , signal)=>{
        console.log(`worker ${worker.process.pid} has been killed`);
        console.log("Starting another worker");
        cluster.fork();
    })
}else{
    const redisClient = createClient({
            host: 'docker-redis-server',  // or 'localhost' if you're running it on your local machine
            port: 6379      // Redis default port
    })
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    (async()=>{
        await redisClient.connect()
        const limiter = rateLimit({
            store: new RedisStore({
                expiry: 60 * 15, 
                sendCommand: (...args) => redisClient.sendCommand(args),
            }),
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again later.',
        });
    app.use('/api',limiter)
    app.use('/api',userRoutes)
    app.use((err,req,res,next)=>{
        console.error(err);
        const statuscode = err.statuscode || 500;
        const message = statuscode === 500 ? 'Internal server error' : err.message;
        res.status(err.statuscode).json({message : err.message, error:true})
    })
    app.listen(port , ()=>console.log(`listing at ${port}`))
    })()
}


