const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        // Extract the token from the cookie
        const token = req.cookies['token']; 

        if (!token) {
            throw new Error('No token provided');
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 

        next();
    } catch (error) {
        res.status(401).send({ message: 'Please authenticate.' });
    }
};

module.exports = authenticate;
