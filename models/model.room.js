const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  label: { type: String, required: true },
  actual_users: { type: Array },
  sensor_ids: { type: Array },
  node_id: { type: String },
  img_url: { type: String },
  locked: { type: Boolean, required: true, default: false },
  capacity: { type: Number },
});

module.exports = mongoose.model("Room", roomSchema);
