const { User } = require("../modal/UserModal");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json({ id: doc.id, role: doc.role });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.logInUser = async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.body.email }
      //   "id, name, email"
    ).exec();
    // console.log({ user });
    if (!user) {
      res.status(401).json({ message: "Invalid Credential" });
    } else if (user.password === req.body.password) {
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        addresses: user.addresses,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid Credential" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
