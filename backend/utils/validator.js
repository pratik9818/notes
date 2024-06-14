const z = require("zod");
exports.emailvalidation = (email) => {
  const emailschema = z.coerce.string().email().min(2).max(255);
  try {
    emailschema.parse(email);
    return true;
  } catch (error) {
    return false;
  }
};
exports.notesnamevalidation = (name) => {
  const notesnameschema = z.coerce.string().min(1).max(50);

  try {
    notesnameschema.parse(name);
    return true;
  } catch (error) {
    return false;
  }
};

exports.passwordvalidation = (password) => {
  const passwordschema = z.coerce.string().min(10)
  try {
    passwordschema.parse(password);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
exports.searchvaluevalidation = (searchvalue) => {
  const searchvalueschema = z.coerce.string().min(1).max(80); // think about should i put spaces check in search value for future
  try {
    searchvalueschema.parse(searchvalue);
    return true;
  } catch (error) {
    return false;
  }
};
