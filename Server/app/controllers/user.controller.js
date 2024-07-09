const db = require("../models");
const User = db.user;
const fs = require('fs');
const path = require('path');

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
  
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
  
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
  
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

// Delete a user account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.userId); // Assuming `req.userId` is populated from auth middleware
    res.send({ message: "Account was deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Delete the old image if it exists
    const oldImagePath = path.join(__dirname, '../uploads', user.userProfileImage);
    if (user.userProfileImage && fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    // Update the user record with the new image file name
    user.userProfileImage = req.file.filename;
    await user.save();
    res.json(user.userProfileImage);
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).send({ message: "Error updating user profile image." });
  }
};
//return user data
exports.getProfileImage = async (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '../uploads', imageName);

  // Check if file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`File not found: ${imagePath}`);
      return res.status(404).send('Image not found');
    }

    // Set the content type
    res.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type accordingly
    res.setHeader('Cache-Control', 'no-store'); // Prevent caching
    const readStream = fs.createReadStream(imagePath);
    readStream.pipe(res);
  });
};

//get image name
exports.getImagename = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    res.json(user);
  }catch(err){
    console.error("Error Loading profile image:", err);
    res.status(500).send({ message: "Error loading profile image." });
  }
}
// Add a friend
exports.addFriend = async (req, res) => {
  // Implement logic to add a friend
};

// Delete a friend
exports.deleteFriend = async (req, res) => {
  // Implement logic to delete a friend
};

// Search for friends
exports.searchFriends = async (req, res) => {
  // Implement logic to search for friends
};