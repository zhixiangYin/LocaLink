const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const upload = require('../middlewares/file-upload');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get("/api/test/mod",[authJwt.verifyToken, authJwt.isModerator],controller.moderatorBoard);

  app.get("/api/test/admin",[authJwt.verifyToken, authJwt.isAdmin],controller.adminBoard);

  // Delete a user account
  app.delete("/api/user/deleteAccount", [authJwt.verifyToken], controller.deleteAccount);

  // Route to upload a user profile image
  app.post('/api/users/:userId/profile-image', upload.single('profileImage'), controller.updateProfileImage);

  //Route to get a user profile image name
  app.get('/api/users/:userId', controller.getImagename);

  // Route to get user profile image
  app.get('/api/images/:imageName', controller.getProfileImage);
};