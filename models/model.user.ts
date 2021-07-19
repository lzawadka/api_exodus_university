const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  id_sensor: { type: String, required: true }
})
  
module.exports = mongoose.model('User', userSchema)



