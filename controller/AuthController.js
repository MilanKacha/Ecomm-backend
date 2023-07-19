const { User } = require("../modal/UserModal");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const SECRET_KEY = "SECRET_KEY";
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
            res.status(201).json(token);
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.logInUser = async (req, res) => {
  res.json(req.user);
  // res.json(req.user);
};

exports.checkUser = async (req, res) => {
  res.json({ status: "success", user: req.user });
};

// exports.logInUser = async (req, res) => {
//   // index.js ma passport banave user authenticate thay tyare
//   res.json({ status: "success" });
//   // try {
//   //   const user = await User.findOne(
//   //     { email: req.body.email }
//   //     //   "id, name, email"
//   //   ).exec();
//   //   // console.log({ user });
//   //   if (!user) {
//   //     res.status(401).json({ message: "Invalid Credential" });
//   //   } else if (user.password === req.body.password) {
//   //     res.status(201).json({
//   //       id: user.id,
//   //       email: user.email,
//   //       name: user.name,
//   //       addresses: user.addresses,
//   //       role: user.role,
//   //     });
//   //   } else {
//   //     res.status(401).json({ message: "Invalid Credential" });
//   //   }
//   // } catch (err) {
//   //   res.status(400).json(err);
//   // }
// };

exports.checkUser = async (req, res) => {
  res.json(req.user);
};
