const { User } = require("../modal/UserModal");

exports.fetchUserById = async (req, res) => {
  // jayare user ni detatils male tyare khali name email & id j male password no male
  // pela params mathi aavto pan have
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    delete user.password;
    delete user.salt;
    res.status(200).json({
      id: user.id,
      addresses: user.addresses,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(err);
  }
};
