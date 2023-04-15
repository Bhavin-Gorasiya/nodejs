const jwt = require("jsonwebtoken");
User = require("../models/user");
const ObjectId = require('mongoose').Types.ObjectId;

const verifyToken = async (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, async function (err, decode) {

            // if (decode) req.user = undefined;
            // console.log(decode, ";;;;;");
            try {
                let user = await User.find({
                    email: decode.id[0].email
                })
                if (user === []) {
                    res.status(403)
                        .send({
                            message: "Invalid JWT token"
                        });
                    // res.status(500)
                    //     .send({
                    //         message: err
                    //     });
                } else {
                    req.user = user;
                    next();
                }
            } catch (e) {
                res.status(400)
                    .send({
                        message: "Unauthorised access"
                    });
                req.user = "undefined";
                next();
                console.log("===>>>>", e)
            }
        });
        // console.log(new ObjectId(decode.id[0]._id));
    } else {
        req.user = undefined;
        res.status(400)
            .send({
                message: "Unauthorised access"
            });
        next();
    }
};
module.exports = verifyToken;