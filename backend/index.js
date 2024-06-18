const express = require('express')
const userRoutes = require('./api/routes/routes.js')
const bodyParser = require('body-parser');
const app = express()
const port = 3001
const cors = require('cors')
app.use(cors({
    origin: 'http://localhost:5173',
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api',userRoutes)
app.use((err,req,res,next)=>{
    console.error(err);
    const statuscode = err.statuscode || 500;
    const message = statuscode === 500 ? 'Internal server error' : err.message;
    res.status(err.statuscode).json({message : err.message, error:true})
})
app.listen(port , ()=>console.log(`listing at ${port}`))