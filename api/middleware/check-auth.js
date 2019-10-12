const jwt = require('jsonwebtoken');
//const User = require('../models/userSchema');
module.exports = (req, res, next) => {
    try {
        let token =req.headers.authorization;
        console.log(token);
        token= token.split(' ')[1];
        console.log(token);
        const decocd=jwt.verify(token,'secret');
        req.userData=decocd;
            next();
        
    }
    catch (err) {
        res.status(401).json({
            message: "err"
        })
    }
}