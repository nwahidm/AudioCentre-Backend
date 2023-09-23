const jwt = require('jsonwebtoken');

module.exports = {
    createToken: (data, secret, options) =>
        new Promise(async (resolve, reject) => {
            console.log('Create Token', { data, secret, options });
            try {
                jwt.sign(data, secret, options, (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                });
            } catch (error) {
                console.log('error', error);
                reject(error);
            }
        }),
    verifyToken: (token, secret) =>
        new Promise(async (resolve, reject) => {
            console.log('Verify Token', { token, secret });
            try {
                jwt.verify(token, secret, function (err, decoded) {
                    resolve(decoded);
                });
            } catch (error) {
                console.log('error', error);
                reject(error);
            }
        })
};
