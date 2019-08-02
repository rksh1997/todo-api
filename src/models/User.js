import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  JWT_SECRET,
  VERIFICATION_SECRET,
  PASSWORD_RESET_SECRET,
  EMAIL_FROM,
  NODE_ENV,
} from '../config';
import { sendEmail } from '../lib/mailer';
import verifyEmailTemplate from '../lib/verifyEmailTemplate';
import resetPasswordTemplate from '../lib/resetPasswordTemplate';

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  facebookID: String,
  resetPasswordToken: String,
});

userSchema.pre('save', async function hashPassword(done) {
  if (this.isModified('password') || (this.isNew && this.password)) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // if new and not oauth registration, create verification token
  if (this.isNew && !this.isVerified) {
    this.verificationToken = this.generateVerificationToken();
    if (NODE_ENV !== 'test') {
      await this.sendVerificationEmail();
    }
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
  const payload = { sub: this._id };
  return jwt.sign(payload, JWT_SECRET);
};

userSchema.methods.toJSON = function toJSON() {
  return {
    id: this._id,
    email: this.email,
  };
};

userSchema.methods.generateVerificationToken = function generateVerificationToken() {
  const payload = {
    id: this._id,
    email: this.email,
  };

  return jwt.sign(payload, VERIFICATION_SECRET);
};

userSchema.methods.sendVerificationEmail = async function sendVerificationEmail() {
  await sendEmail({
    from: EMAIL_FROM,
    to: this.email,
    subject: 'Confirm your TodoApp email',
    html: verifyEmailTemplate(this.verificationToken),
  });
};

userSchema.methods.sendPasswordResetEmail = async function sendPasswordResetEmail() {
  this.resetPasswordToken = jwt.sign(
    {
      email: this.email,
      exp: Math.floor(Date.now() / 1000) + 4 * 60 * 60,
    },
    PASSWORD_RESET_SECRET,
  );
  await this.save();
  if (NODE_ENV !== 'test') {
    await sendEmail({
      from: EMAIL_FROM,
      to: this.email,
      subject: 'Reset you TodoApp password',
      html: resetPasswordTemplate(this.resetPasswordToken),
    });
  }
};

export default mongoose.model('User', userSchema);
