const express = require("express");
const path = require("path");
const port = process.env.PORT || 5000;
const cors = require("cors");
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
const uri = "mongodb+srv://root:root@cluster0.z61hf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
require('dotenv').config();
// Route
const userRouter = require("./routes/route.user.js");
const sensorRouter = require("./routes/route.sensor.js");
const roomRouter = require("./routes/route.room.js");

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/sensor", sensorRouter);
app.use("/room", roomRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send();
});

app.listen(port, () => {
  console.log(`Server running at here ${port}`);
});

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(app.listen(3000))
  .catch();
