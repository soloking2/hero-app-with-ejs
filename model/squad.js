const mongoose = require('mongoose');

const {Schema} = mongoose;

const squadSchema = new Schema({
  name: {type: String, required: true, unique: true},
  hq: String
});

module.exports = mongoose.model('Squad', squadSchema);