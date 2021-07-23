//in AuthController.js
const { forEach } = require("lodash");
const { User } = require("../models/model.user");

exports.RegisterUser = async (req, res) => {
  const user = new User(req.body);
  const userFind = await User.findOne({ email: req.body.email });
  if (userFind != null) {
    return res.status(418).json({
      success: false,
      message: "User already exist",
      email: req.body.email,
    });
  }
  await user.save((err, doc) => {
    if (err) {
      return res.status(418).json({ errors: err });
    } else {
      const userData = {
        firtsName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
      };
      return res.status(200).json({
        success: true,
        message: "Successfully Signed Up",
        userData,
      });
    }
  });
};

exports.LoginUser = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User email not found!",
      });
    } else {
      console.log(user);
      user.comparePassword(req.body.password, (err, isMatch) => {
        console.log(isMatch);
        //isMatch is eaither true or false
        if (!isMatch) {
          return res
            .status(400)
            .json({ success: false, message: "Wrong Password!" });
        } else {
          user.generateToken((err, user) => {
            if (err) {
              return res.status(400).send({ err });
            } else {
              const data = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                profile_picture: user.profile_picture
              }
              //saving token to cookie
              res.cookie("authToken", user.token).status(200).json({
                success: true,
                message: "Successfully Logged In!",
                userData: data,
              });
            }
          });
        }
      });
    }
  });
};
exports.LogoutUser = (req, res) => {
  User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      token: "",
    },
    (err) => {
      if (err) return res.json({ success: false, err });
      return res
        .status(200)
        .send({ success: true, message: "Successfully Logged Out!" });
    }
  );
};
//get authenticated user details
exports.GetUserDetails= (req, res) => {
  return res.status(200).json({
    isAuthenticated: true,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    role: req.user.role,
    id_sensor: req.user.id_sensor,
    profile_picture: req.user.profile_picture
  });
};
//get authenticated user details
exports.UpdateUser = (req, res) => {
  let token = req.cookies['authToken'];
  User.findByToken(token, (err, user) => {
    if (user.role == "ADMIN") {
      User.findOne({ 'email': req.body.email }, (err, user) => {
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User email not found!'
          });
        }
        if (req.body.password != null && req.body.password != '')
          user.password = req.body.password
        if (req.body.profile_picture != null && req.body.profile_picture != '')
          user.profile_picture = req.body.profile_picture
        if (req.body.id_sensor != null && req.body.id_sensor != '')
          user.id_sensor = req.body.id_sensor
        if (req.body.role != null && req.body.role != '')
          user.role = req.body.role

        user.save((err, doc) => {
          if (err) {
            return res.status(418).json({
              errors: err
            })
          } else {
            console.log(doc, "doc");
            return res.status(200).json({
              success: true,
              message: 'Successfully Update'
            })
          }
        });
      })
    } else {
      return res.status(403).json({
        message: `You are not allowed to update users. You are ${user.role}`
      })
    }
    
  })
};
//get all users
exports.GetAllUsers = (req, res) => {
  let usersArray = [];
  User.find({}, (err, users) => {
    users.forEach((user) => {
      const data = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture,
        id_sensor: user.id_sensor
      }
      usersArray.push(data)
    })
    
    res.status(200).json({success: true, users: usersArray});  
  }).limit(20);
};

