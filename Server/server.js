const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const dbConfig = require("./app/config/db.config");

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount()
    .then((count) => {
      if (count === 0) {
        // Document count is 0, proceed to save new roles
        new Role({ name: "user" }).save().then(() => console.log("added 'user' to roles collection")).catch(err => console.log("error", err));
        new Role({ name: "moderator" }).save().then(() => console.log("added 'moderator' to roles collection")).catch(err => console.log("error", err));
        new Role({ name: "admin" }).save().then(() => console.log("added 'admin' to roles collection")).catch(err => console.log("error", err));
      }
    })
    .catch((err) => {
      console.error("Error checking the role count:", err);
    });
}
