// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const usersSchema = new Schema({
//     Username: { type: String, required: true },
//     password: { type: String, required: true}
//   },
//   {timestamps: true});
//   const Users = mongoose.model('user', usersSchema);
//   module.exports = Users  




  const mongoose = require('mongoose');
  const Schema = mongoose.Schema
  const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String, required: true, unique: true, value: this.name,  default: "default username"
            },
  password: {
    type: String, required: true, value: this.password, default: "default password"
            }
},
   {timestamps: true});

// Hash password before saving to the database
userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
