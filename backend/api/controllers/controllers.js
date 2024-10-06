const { database } = require("../../database/database");
// const { comparepasswords } = require("../../utils/comparepasswords");
const { generateToken } = require("../../utils/generatetoken");
const bcrypt = require('bcryptjs');
const { emailvalidation, passwordvalidation, notesnamevalidation, searchvaluevalidation } = require("../../utils/validator");

exports.signupuser = async (req, res, next) => {
        const client = await database();
        const password = req.body.password;
        const email = req.body.email;
        const last_login = req.body.last_login
        const isemailvalidate = emailvalidation(email)
        if (!isemailvalidate) {
                return next({ statuscode: 400, message: 'fill proper email', error: true })
        }
        let isuserpersent = await isemialpersent(email)
        if (isuserpersent) {
                next({ statuscode: 401, message: 'user already persent', error: true })
                return
        }
        const insertuser = `INSERT INTO notesusers (email , password ,last_login) VALUES ($1 , $2 , $3) RETURNING user_id` //need to chnage in column constraints
        const values = [email, password, last_login]
        try {
                const response = await client.query(insertuser, values)
                const user_id = response.rows[0].user_id
                //        console.log(user_id);
                const token = generateToken(user_id)
                res.setHeader('Authorization', `Bearer ${token}`)
                res.status(200).json({ message: 'successfully login', status: 200, token: `Bearer ${token}`, useremail: email })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })
        }
}

exports.signinuser = async (req, res, next) => {
        const client = await database();
        const password = req.query.password;
        const email = req.query.email;
        const last_login = req.query.last_login
        const isemailvalidate = emailvalidation(email)
        const ispasswordvalidate = passwordvalidation(password)
        if (!isemailvalidate || !ispasswordvalidate) {
                return next({ statuscode: 400, message: 'fill proper email and password', error: true })
        }
        const getuser = `SELECT password , user_id FROM notesusers WHERE email = '${email}'`
        try {
                const user = await client.query(getuser)
                if (user.rows.length) { //loophole i am checking email and password in defferent login
                        const dbhashpassword = user.rows[0].password // need to think about if user signup using google then if use native signup/login after that how i will handle this
                        const user_id = user.rows[0].user_id
                        bcrypt.compare(password, dbhashpassword, async function (err, result) {
                                if (err) {
                                        next({ statuscode: 500, message: 'something went wrong please try again', error: err })
                                } else if (result) {
                                        const updateLastlogin = `UPDATE notesusers SET last_login = $1 WHERE email = $2`
                                        const value = [last_login, email]
                                        try {
                                                const result = await client.query(updateLastlogin, value)
                                                //  console.log(result ,'last login updated');
                                                if (result) {
                                                        const token = generateToken(user_id)
                                                        res.setHeader('Authorization', `Bearer ${token}`)
                                                        res.status(200).json({ message: 'successfully login', status: 200, token: `Bearer ${token}`, useremail: email })
                                                }
                                        } catch (error) {
                                                next({ statuscode: 500, message: 'something went worng', error: error })
                                        }
                                } else {
                                        next({ statuscode: 401, message: 'password is wrong', error: true })
                                }
                        });
                } else {
                        next({ statuscode: 401, message: 'email is wrong', error: true })
                }

        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })
        }

}

async function isemialpersent(email) {
        const client = await database();
        const user = `SELECT email FROM notesusers WHERE email = '${email}'`
        const res = await client.query(user)
        if (res.rows.length) {
                return true
        } else {
                return false
        }
}

exports.addnote = async (req, res, next) => {
        const client = await database();
        const notename = req.body.notename;
        const user_id = req.user_id;
        const date = new Date().toUTCString()
        //        const isemailvalidate = emailvalidation(email)
        const isnotenamevalidate = notesnamevalidation(notename)
        if (!isnotenamevalidate) {
                return next({ statuscode: 400, message: 'note name should has min 1 char and max 50' })
        }
        //        if (!isemailvalidate) {
        //         return next({statuscode:400, message:'your email is not valid'})
        //       }
        //        if (!user_id) {
        //         return next({statuscode:400, message:'email not found please login'})
        //       }
        const addnoterow = `INSERT INTO notes (notename , user_id , updated_at) VALUES ($1 , $2 , $3) RETURNING noteid`
        const value = [notename, user_id, date]
        try {
                const result = await client.query(addnoterow, value)
                // console.log(result.rows[0].noteid);

                res.status(201).json({ message: 'note created', noteid: result.rows[0].noteid, status: 200 })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })
        }
}
exports.updatenotedescription = async (req, res, next) => {
        //need to check description length || is descriotion persent or not || proper validation
        const client = await database();
        const noteid = req.params.noteid;
        const notedescription = req.body.notedescription;
        const date = new Date().toUTCString()
        const user_id = req.user_id

        const updatenotedescription = `UPDATE notes SET notedescription = $1 ,updated_at = $2 WHERE user_id = $3 AND noteid = $4`
        const value = [notedescription, date, user_id, noteid]
        try {
                const result = await client.query(updatenotedescription, value)
                // if (result.rowCount === 0) {
                //         // return res.status(404).send('Note not found');
                //        return next({statuscode:404, message:'Note not found',error:error})

                //       } // need to check this commeneted condition
                res.status(200).json({ message: 'description updated', status: 200 })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })
        }
}
exports.updatenotename = async (req, res, next) => {
        //need to check description length || is descriotion persent or not || proper validation
        const client = await database();
        const noteid = req.params.noteid;
        const notename = req.body.notename;
        const date = new Date().toUTCString()
        const isnotenamevalidate = notesnamevalidation(notename)
        if (!isnotenamevalidate) {
                return next({ statuscode: 400, message: 'note name should has min 1 char and max 25' })
        }
        if (!noteid || !notename) {
                return next({ statuscode: 400, message: 'Note ID and note name are required' })
        }
        const updatenotename = `UPDATE notes SET notename = $1 , updated_at = $2 WHERE noteid = $3`
        const value = [notename, date, noteid]
        try {
                const result = await client.query(updatenotename, value)
                // if (result.rowCount === 0) {
                //         return res.status(404).send('Note not found');

                //       }
                res.status(200).json({ message: 'note name updated', status: 200 })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })
        }
}
exports.getallnotenames = async (req, res, next) => {
        const client = await database();
        const user_id = req.user_id
        const offsetnumber = req.query.notesnumber
        // console.log(offsetnumber);

        // console.log(user_id);
        // const isemailvalidate = emailvalidation(email)
        // if(!isemailvalidate){
        //       return next({statuscode:400, message:'your email is not valid'})
        // }
        const getallnote = `SELECT noteid , notename ,created_at,isshare,access_type from notes WHERE user_id = $1 ORDER BY created_at DESC  LIMIT 7 OFFSET $2`
        try {
                const result = await client.query(getallnote, [user_id, offsetnumber])
                //        console.log(result.rowCount);
                if (result.rowCount === 0) {
                        return next({ data: result.rows, statuscode: 204, message: 'no any notes persent' })

                }
                res.status(200).json({ data: result.rows, rowcount: result.rowCount, statuscode: 200 })
        } catch (error) {

                next({ statuscode: 500, message: 'something went worng', error: error })
        }
}
exports.getnotedescription = async (req, res, next) => {
        const client = await database();
        const noteid = req.params.noteid
        const user_id = req.user_id

        if (!noteid) {
                return next({ statuscode: 400, message: 'noteid is not persent' })
        }
        const getdescription = `SELECT notedescription from notes WHERE user_id = $1 AND noteid = $2`
        try {
                const result = await client.query(getdescription, [user_id, noteid])
                // if (result.rowCount === 0) {
                //         return res.status(404).send('notes description not persent');
                //       } //handle when notes decription not persent
                res.status(200).json({ data: result.rows, status: 200 })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })
        }
}
exports.deletenote = async (req, res, next) => {
        const client = await database();
        const noteid = req.params.noteid
        const user_id = req.user_id
        if (!noteid) {
                return next({ statuscode: 400, message: 'noteid is not persent' })
        }
        const deletenote = `DELETE from notes WHERE user_id = $1 AND noteid = $2 `
        try {
                const result = await client.query(deletenote, [user_id, noteid])
                res.status(200).json({ message: 'note has been deleted', status: 200 })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })
        }
}

exports.searchnotes = async (req, res, next) => {
        const client = await database();
        const searchvalue = req.query.search
        const user_id = req.user_id
        // const isemailvalidate = emailvalidation(email)
        const issearchvaluevalidate = searchvaluevalidation(searchvalue) // i can remove in future
        if (!issearchvaluevalidate) {
                return next({ statuscode: 400, message: 'search value must be min 1 char and max 80' })
        }
        // if(!isemailvalidate){
        //       return next({statuscode:400, message:'your email is not valid'})
        // }
        const searchquery = `SELECT * FROM notes WHERE user_id='${user_id}' AND (notename ILIKE $1 OR notedescription ILIKE $1) LIMIT 10`
        const search = [`%${searchvalue}%`]
        try {
                const result = await client.query(searchquery, search)

                res.status(200).json({ data: result.rows, rowcount: result.rowCount, status: 200 })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })
        }
}

exports.getsharelinkcontent = async (req, res, next) => {
        const client = await database();
        const { noteid } = req.params;

        if (!noteid) return next({ statuscode: 400, message: 'noteid is not persent' })
        try {
                const getnoteidDetail = `SELECT isshare , notedescription FROM notes WHERE noteid=$1`
                const { rows: [{ isshare, notedescription }] } = await client.query(getnoteidDetail, [noteid])
                if (!isshare) return res.status(401).json({ message: 'access deneid', status: 401 })
                res.status(200).json({ data: notedescription, rowcount: 1, statuscode: 200 })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })
        }
}

exports.editnotedescription = async (req, res, next) => {
        const client = await database();
        const notedescription = req.body.notedescription
        const updateddate = new Date().toUTCString()
        const { noteid } = req.params;
        if (!noteid) return next({ statuscode: 400, message: 'noteid is not persent' })
        try {
                const getnoteidDetail = `SELECT isshare ,access_type FROM notes WHERE noteid=$1`
                const updatenotedescription = `UPDATE notes SET notedescription=$1,updated_at=$2 WHERE noteid=$3`
                const { rows: [{ isshare, access_type }] } = await client.query(getnoteidDetail, [noteid])
                if (!isshare || access_type === 'read') res.status(401).json({ message: 'access deneid', status: 401 })
                if (access_type === 'edit' && isshare) {
                        await client.query(updatenotedescription, [notedescription, updateddate, noteid])
                        res.status(200).json({ message: 'description updated', status: 200 })
                }
                // res.status(401).json({ message: 'access deneid', status: 401 })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })
        }
}

exports.editnoteshareaccess = async (req, res, next) => {
        const client = await database();
        const { noteid } = req.params
        const user_id = req.user_id
        let sharevalue = null
        if(req.body.share === 'true') sharevalue = true;
        else sharevalue = false
        const updateddate = new Date().toUTCString(); //not updating in db , check in db for conformation

        if (!noteid) return next({ statuscode: 400, message: 'noteid absent' })
        if (!user_id) return next({ statuscode: 401, message: 'access deneid' })

        try {
                const updateaccess = `UPDATE notes SET isshare=$1, share_date=$2 WHERE user_id=$3 AND noteid=$4`
                await client.query(updateaccess, [sharevalue, updateddate, user_id, noteid])
                res.status(200).json({ message: "share access updated", status: 200 })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })

        }
}
exports.editnoteaccesstype = async (req, res, next) => {
        const client = await database();
        const { noteid } = req.params
        const user_id = req.user_id
        const accesstype = req.body.accesstype;

        if (!noteid) return next({ statuscode: 400, message: 'noteid absent' })
        if (!user_id) return next({ statuscode: 401, message: 'access deneid' })

        try {
                const updateaccess = `UPDATE notes SET access_type=$1 WHERE user_id=$2 AND noteid=$3`
                await client.query(updateaccess, [accesstype, user_id, noteid])
                res.status(200).json({ message: "access type updated", status: 200 })
        } catch (error) {
                next({ statuscode: 500, message: 'something went worng', error: error })

        }
}