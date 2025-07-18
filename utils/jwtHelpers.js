const jwt = require("jsonwebtoken");

const attachJWTToken = (res, data) => {
    const token = jwt.sign(data, process.env.JWT_SECRET);

    res.cookie("authorization", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production', // only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // allow cross-site in production
        httpOnly: true, // frontend will not be able to read this cookie
        // so that our token is out of reach of javascript --> hackers
    });
};

const removeJWTToken = (res) => {
    res.cookie("authorization", "", {
        maxAge: 0,
        secure: process.env.NODE_ENV === 'production', // only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // allow cross-site in production
        httpOnly: true, // frontend will not be able to read this cookie
        // so that our token is out of reach of javascript --> hackers
    });
};

module.exports = { attachJWTToken, removeJWTToken };
