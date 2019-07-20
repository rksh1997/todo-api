import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: String,
});

userSchema.pre('save', async function hashPassword(done) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  done();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return new Promise(resolve => {
    bcrypt.compare(password, this.password, (err, res) => {
      if (err || !res) resolve(false);
      resolve(true);
    });
  });
};

userSchema.methods.generateLoginToken = function generateLoginToken() {
  // eslint-disable-next-line
  const payload = { sub: this._id };
  return jwt.sign(payload, JWT_SECRET);
};

userSchema.methods.toJSON = function toJSON() {
  return {
    // eslint-disable-next-line
    id: this._id,
    email: this.email,
  };
};

export default mongoose.model('User', userSchema);
