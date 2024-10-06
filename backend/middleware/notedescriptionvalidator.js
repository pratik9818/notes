exports.notedescriptionvalidator = (req, res, next) => {
    const noteid = req.params.noteid;
    const notedescription = req.body.notedescription
    
    const descriptionchar = notedescription.length
    const charlimit = 5000

    if (!noteid || !notedescription) {
         next({ statuscode: 400, message: 'Note ID and note description are required' })
    }
    if (descriptionchar > charlimit) {
         next({ statuscode: 400, message: 'Note can not be more then 5 k char' })
    }
    next() 
}