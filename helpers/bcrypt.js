const bcrypt = require('bcryptjs');

module.exports = {
    hashPassword: (password) =>
        new Promise(async (resolve, reject) => {
            console.log('hashPassword', { password });
            try {
                const salt = await bcrypt.genSalt(10);

                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) reject(err);
                    resolve(hash);
                });
            } catch (error) {
                console.log('error', error);
                reject(error);
            }
        }),
    verifyPassword: (password, hash) =>
        new Promise(async (resolve, reject) => {
            console.log('verifyPassword', { password, hash });
            try {
                bcrypt.compare(password, hash, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            } catch (error) {
                console.log('error', error);
                reject(error);
            }
        })
};
