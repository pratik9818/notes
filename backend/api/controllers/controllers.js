const {database } = require("../../database/database");
// const { comparepasswords } = require("../../utils/comparepasswords");
const { generateToken } = require("../../utils/generatetoken");
const bcrypt = require('bcrypt');
const { emailvalidation,passwordvalidation, notesnamevalidation,searchvaluevalidation } = require("../../utils/validator");

exports.signupuser = async (req,res,next)=>{
        const client = await database();
        const password = req.body.password;
        const email = req.body.email;
        console.log(password);
        const isemailvalidate = emailvalidation(email)
        if(!isemailvalidate ){
              return next({statuscode:400, message:'fill proper email',error:true})
        }
       let isuserpersent =  await isemialpersent(email)
       if(isuserpersent){
        next({statuscode:401, message:'user already persent',error:true})
        return
       }
        const insertuser = `INSERT INTO notesusers (email , password) VALUES ($1 , $2)` //need to chnage in column constraints
        const values = [email,password]
       try {
        await client.query(insertuser, values)
        const token = generateToken(email)
        res.setHeader('Authorization', `Bearer ${token}`)
        res.status(200).json({message:'successfully login', status:200, token:`Bearer ${token},`,useremail:email})
       } catch (error) {
        next({statuscode:500, message:'something went worng',error:error})
       }
}

exports.signinuser = async(req,res,next)=>{
        const client = await database();
        const password = req.query.password;
        const email = req.query.email;
        const isemailvalidate = emailvalidation(email)
        const ispasswordvalidate = passwordvalidation(password)
        if(!isemailvalidate || !ispasswordvalidate){
              return next({statuscode:400, message:'fill proper email and password',error:true})
        }
        const getuser = `SELECT password FROM notesusers WHERE email = '${email}'`
        try {
          const user =  await client.query(getuser) 
          if(user.rows.length){ //loophole i am checking email and password in defferent login
                const dbhashpassword =  user.rows[0].password // need to think about if user signup using google then if use native signup/login after that how i will handle this
                bcrypt.compare(password,dbhashpassword, function(err, result) {
                        if (err) {
                                next({statuscode:500, message:'something went wrong please try again',error:err})
                        } else if (result) {
                            const token = generateToken(email)
                            res.setHeader('Authorization', `Bearer ${token}`)
                          res.status(200).json({message:'successfully login', status:200, token:`Bearer ${token}`,useremail:email})
                        } else {
                                next({statuscode:401, message:'password is wrong',error:true})
                        }
                    });
          }else{
                next({statuscode:401, message:'email is wrong',error:true})
          }
          
        } catch (error) {
                next({statuscode:500, message:'something went worng',error:error})
        }
        
}

async function isemialpersent(email){
const client = await database();
const user = `SELECT email FROM notesusers WHERE email = '${email}'`
const res = await client.query(user)
if(res.rows.length){
        return true
}else{
        return false
}
}

exports.addnote = async (req,res,next)=>{
        const client = await database();
       const notename = req.body.notename;
       const email = req.email;
       const isemailvalidate = emailvalidation(email)
       const isnotenamevalidate = notesnamevalidation(notename)
       if(!isnotenamevalidate){
       return next({statuscode:400, message:'note name should has min 1 char and max 50'})
       }
       if (!isemailvalidate) {
        return next({statuscode:400, message:'your email is not valid'})
      }
       if (!email) {
        return next({statuscode:400, message:'email not found please login'})
      }
       const addnoterow = `INSERT INTO notes (email , notename) VALUES ($1 , $2 ) RETURNING noteid`
       const value = [email , notename]
       try {
        const result = await client.query(addnoterow , value)
        console.log(result.rows[0].noteid);

        res.status(201).json({message : 'note created' ,noteid :result.rows[0].noteid , status:200})
       } catch (error) {
        next({statuscode:500, message:'something went worng',error:error})
       }
}
exports.updatenotedescription = async (req,res,next)=>{
        //need to check description length || is descriotion persent or not || proper validation
        const client = await database();
        const noteid = req.params.noteid;
       const notedescription = req.body.notedescription;
        const date = new Date()
      
       if (!noteid || !notedescription) {
       return next({statuscode:400, message:'Note ID and note description are required'})
      }
       const updatenotedescription = `UPDATE notes SET notedescription = $1 ,updated_at = $2 WHERE noteid = $3`
       const value =  [notedescription, date, noteid]
       try {
        const result = await client.query(updatenotedescription , value)
        // if (result.rowCount === 0) {
        //         // return res.status(404).send('Note not found');
        //        return next({statuscode:404, message:'Note not found',error:error})
                
        //       } // need to check this commeneted condition
        res.status(200).json({message : 'description updated' , status:200})
       } catch (error) {
        next({statuscode:500, message:'something went worng',error:error})
       }
}
exports.updatenotename = async (req,res,next)=>{
        //need to check description length || is descriotion persent or not || proper validation
        const client = await database();
        const noteid = req.params.noteid;
       const notename = req.body.notename;
       const date = new Date()
       const isnotenamevalidate = notesnamevalidation(notename)
       if(!isnotenamevalidate){
        return next({statuscode:400, message:'note name should has min 1 char and max 25'})
       }
       if (!noteid || !notename) {
        return next({statuscode:400, message:'Note ID and note name are required'})
      }
       const updatenotename = `UPDATE notes SET notename = $1 , updated_at = $2 WHERE noteid = $3`
       const value =  [notename, date , noteid]
       try {
        const result = await client.query(updatenotename , value)
        // if (result.rowCount === 0) {
        //         return res.status(404).send('Note not found');

        //       }
        res.status(200).json({message : 'note name updated' , status:200})
       } catch (error) {
        next({statuscode:500, message:'something went worng',error:error})
       }
}
exports.getallnotenames = async (req,res,next)=>{
        const client = await database();
        const email = req.email
        const isemailvalidate = emailvalidation(email)
        if(!isemailvalidate){
              return next({statuscode:400, message:'your email is not valid'})
        }
       const getallnote = `SELECT noteid , notename from notes WHERE email = '${email}'`
       try {
        const result = await client.query(getallnote)
        if (result.rowCount === 0) {
               return next({statuscode:204, message:'no any notes persent'})

              }
        res.status(200).json({data:result.rows , rowcount : result.rowCount , status:200})
       } catch (error) {
        
        next({statuscode:500, message:'something went worng',error:error})
       }
}
exports.getnotedescription = async (req,res,next)=>{
        const client = await database();
        const noteid = req.params.noteid
        
        if(!noteid){
               return next({statuscode:400, message:'noteid is not persent'})
        }
       const getdescription = `SELECT notedescription from notes WHERE noteid = '${noteid}'`
       try {
        const result = await client.query(getdescription)
        // if (result.rowCount === 0) {
        //         return res.status(404).send('notes description not persent');
        //       } //handle when notes decription not persent
        res.status(200).json({data:result.rows , status:200})
       } catch (error) {
        next({statuscode:500, message:'something went worng',error:error})
       }
}
exports.deletenote = async (req,res,next)=>{
        const client = await database();
        const noteid = req.params.noteid
        if(!noteid){
              return  next({statuscode:400, message:'noteid is not persent'})
        }
       const deletenote = `DELETE from notes WHERE noteid = '${noteid}'`
       try {
        const result = await client.query(deletenote)
        res.status(200).json({message:'row has beed deleted' , status:200})
       } catch (error) {
        next({statuscode:500, message:'something went worng',error:error})
       }
}

exports.searchnotes = async (req,res,next)=>{
        const client = await database();
        const searchvalue = req.query.search
        const email = req.email
        const isemailvalidate = emailvalidation(email)
        const issearchvaluevalidate = searchvaluevalidation(searchvalue) // i can remove in future
        if(!issearchvaluevalidate){
                return next({statuscode:400, message:'search value must be min 1 char and max 80'})
        }
        if(!isemailvalidate){
              return next({statuscode:400, message:'your email is not valid'})
        }
       const searchquery = `SELECT * FROM notes WHERE email='${email}' AND (notename ILIKE $1 OR notedescription ILIKE $1) LIMIT 10`
       const search = [`%${searchvalue}%`]
       try {
        const result = await client.query(searchquery,search)
        
        res.status(200).json({data:result.rows , rowcount : result.rowCount , status:200})
       } catch (error) {
        next({statuscode:500, message:'something went worng',error:error})
       }
}