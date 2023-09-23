const { split } = require('lodash');
const { verifyToken } = require('../helpers/jwt');

module.exports = {
    authMiddleware: async (req, res, next) => {
        const indexHeaders = req.headers;
        const access_token = split(indexHeaders.authorization, ' ')[1];

        if (!access_token)
            return res.status(401).send({
                status: 401,
                error: 'Unauthorized',
                message: 'Otorisasi gagal! Silahkan login terlebih dahulu.'
            });

        const userInfo = await verifyToken(access_token, process.env.SECRET);

        if (userInfo) {
            req.user = userInfo;
            next();
        } else {
            return res.status(401).send({
                status: 401,
                error: 'Unauthorized',
                message: 'Otorisasi gagal! Silahkan login terlebih dahulu.'
            });
        }
    }
};
