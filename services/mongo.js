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
      console.log(
        `Connected to Mongo! Database name: "${x.connections[0].name}"`
      );
    })
    .catch((err) => {
      console.error("Error connecting to mongo", err);
    });
  return mongoose;
};

exports.mongoClose = async () => {
  return mongoose.connection.close();
};
