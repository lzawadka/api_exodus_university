const mongoose = require("mongoose");
// require("dotenv").config();

exports.mongo = async () => {
  await mongoose
    .connect(
      "mongodb+srv://root:root@cluster0.z61hf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    )
    .then((x) => {
      console.log("-----------------------------------");
      console.log(`Connected to Mongo DB!`);
    })
    .catch((err) => {
      console.error("Error connecting to mongo", err);
    });
  return mongoose;
};

exports.mongoClose = async () => {
  return mongoose.connection.close();
};
