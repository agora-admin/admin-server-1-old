var jwt = require('jsonwebtoken');

const getServerToken = () => {
    return new Promise((resolve, reject) => {
        jwt.sign({
            code : 'E431FF83935C9C8F7D77EB19A2DCD',
            env: 'production',
            iat: Math.floor(Date.now() / 1000)
        },
        process.env.SECRET_KEY,
        {
            algorithm: 'HS256',
        },
        (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        }
        )
    })
}

const checkAuth = async (req, res, next) => {
    const token = req.headers['authorization'].split('Bearer ')[1];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        next();
    });
}

module.exports = {
    checkAuth
}