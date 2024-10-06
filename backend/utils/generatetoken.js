const jwt = require('jsonwebtoken');
const secret_key = '50!@458**&^$r34@(#&fg&*485hgfo#$f49opj#%@$)*ndk$%gyf8ojdpfj9j'
exports.generateToken = (userId) => {
    const expirestoken = 3600 * 1000
    return jwt.sign({ userId }, secret_key, { expiresIn: expirestoken });
};
