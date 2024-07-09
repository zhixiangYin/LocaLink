const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true, // Ensures username is unique in the collection
    trim: true, // Trims whitespace from the username
    lowercase: true, // Converts username to lowercase
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  userProfileImage: {
    type: String,
    default: '' // Default value if no image is provided
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
