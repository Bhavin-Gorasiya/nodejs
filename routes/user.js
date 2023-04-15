var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var User = require("../models/user");
var express = require("express");
const verifyToken = require("../middlewares/authJWT");
router = express.Router();

const app = express();
app.use(express.json);

router.post("/register", function (req, res) {
    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save();
    res.status(200)
        .send({
            message: "User Registered successfully"
        });

});

router.post("/login", async function (req, res) {
    let user = await User.find({
        email: req.body.email
    });
    // console.log(user)
    if (user !== []) {
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user[0].password
        );

        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
            return res.status(401)
                .send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
        }
        //signing token with user id
        var token = jwt.sign({
            id: user
        }, process.env.API_SECRET, {
            expiresIn: 86400
        });
        //responding to client request with user profile success message and  access token
        res.status(200)
            .send({
                user: {
                    id: user[0]._id,
                    email: user[0].email,
                    fullName: user[0].fullName,
                },
                message: "Login successfull",
                accessToken: token,
            });

    } else {
        if (!user) {
            return res.status(404)
                .send({
                    message: "User Not found."
                });
        }
    }
});

router.get("/hiddencontent", verifyToken, async function (req, res) {
    console.log(req.user)
    res.status(200)
        .send({
            message: "Congratulations! but there is no hidden content",
            result: req.user
        });
});


router.get("/getData", async function (req, res) {
    let limit = req.query.limit;
    let page = req.query.page;
    let user = await User.find().limit(limit).skip((limit * page) - limit);
    res.status(200).send({
        message: "Sucessfully get data",
        result: user
    })
})

module.exports = router;