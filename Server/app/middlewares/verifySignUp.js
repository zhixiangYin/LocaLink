const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsername = async(req, res, next) => {
  try {
    // Check for duplicate username
    const userByUsername = await User.findOne({ username: req.body.username }).exec();
    console.log(userByUsername);
    if (userByUsername) {
      res.status(400).send({ message: `Failed! Username ${userByUsername.username} is already in use!` });
      return;
    }
    next();
  } catch (err) {
    res.status(500).send({ message: err });
    return;
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsername,
  checkRolesExisted
};

module.exports = verifySignUp;