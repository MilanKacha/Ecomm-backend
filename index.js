const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
const productsRouters = require("./route/ProductsRoute");
const categoriesRouter = require("./route/CategoryRoute");
const brandsRouter = require("./route/BrandsRoute");
const userRouter = require("./route/UserRoute");
const authRouter = require("./route/AuthRoute");
const cartRouter = require("./route/CartRoute");
const orderRouter = require("./route/OrderRoute");
const path = require("path");
const { User } = require("./modal/UserModal");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");

const SECRET_KEY = "SECRET_KEY";
// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY; // TODO: should not be in code;

// client thi je cookie aave te vache
server.use(express.static(path.join(__dirname, "./build")));
server.use(cookieParser());
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));
server.use(passport.initialize());
server.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); //to parse req.body
// server.use(cors({ origin: "your_frontend_url", credentials: true }));
server.use("/products", isAuth(), productsRouters.router);
// we can also use JWT token for client-only auth
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    // console.log({ email, password });
    try {
      const user = await User.findOne({ email: email });
      // console.log(email, password, user);
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), "SECRET_KEY");

          done(null, { token }); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
// passport.js na doc mathi authentication mathi
// passport.serializeUser(function (user, cb) {
//   console.log("serialize", user);
//   process.nextTick(function () {
//     return cb(null, { id: user.id, role: user.role });
//   });
// });
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});
// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Mongodb connection
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecomm");
  console.log("DB connected successfully");
}

// server.get("/", (req, res) => {
//   res.json({ status: "success" });
// });

server.listen(8080, () => {
  console.log("server started");
});
