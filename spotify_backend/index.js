const express= require("express");
require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./models/user");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
const mongoose = require("mongoose");
const { eventNames } = require("./models/user");
const cors = require("cors")
const app = express();
const port = 8080;  
app.use(cors());
app.use(express.json())



mongoose
    .connect(
        process.env.MONGODB_URI,
    ).then((x) => {
        console.log("Connected to Mongo!");
    })
    .catch((err) => {
        console.log(err);
        console.log("Error while connecting to Mongo");
    });
// setup passport-jwt
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findOne({ _id: jwt_payload.identifier });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            console.log("Identified an error");
            return done(err, false);
        }
    })
);
app.get("/", (req, res)=> {
    res.send("hello world");
});

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

app.listen(port, ()=>{
    console.log("App is running on port " + port);
});
