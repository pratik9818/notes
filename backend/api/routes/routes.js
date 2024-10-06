const express = require('express')
const router = express.Router()
const controller = require('../controllers/controllers.js')
const { credentialscheck } = require('../../middleware/crenditialscheck.js') //need to fix it
const { passwordencrypt } = require('../../middleware/passwordencrypt.js')
const { verifyjwttoken } = require('../../middleware/verifytoken.js')
const { notedescriptionvalidator } = require('../../middleware/notedescriptionvalidator.js')
const limiter = require('../../middleware/ratelimiter.js')

router.post('/signup',passwordencrypt, controller.signupuser)
router.get('/signin',controller.signinuser)
router.post('/addnote',verifyjwttoken, controller.addnote)
router.patch('/updatenote/notedescription/:noteid',verifyjwttoken ,notedescriptionvalidator,controller.updatenotedescription)
router.put('/updatenote/notename/:noteid', verifyjwttoken, controller.updatenotename)
router.get('/getnote/allnotenames',verifyjwttoken,controller.getallnotenames)
router.get('/getnote/notedescription/:noteid',verifyjwttoken,controller.getnotedescription)
router.delete('/deletenote/:noteid' , verifyjwttoken , controller.deletenote)
router.get('/searchnotes/', verifyjwttoken , controller.searchnotes)
router.get('/sharelink/getnote/:noteid', controller.getsharelinkcontent)
router.patch('/sharelink/edit/notedescription/:noteid',notedescriptionvalidator, controller.editnotedescription)
router.patch('/sharelink/edit/shareaccess/:noteid',verifyjwttoken, controller.editnoteshareaccess)
router.patch('/sharelink/edit/accesstype/:noteid', verifyjwttoken,controller.editnoteaccesstype)
module.exports = router


//usernotes table columns
//update timestamp
//creaeted timestamp
//email id
//notes name
//notes description
//unique id

//searching 
//by name
//by descrition