import User from '../models/User';
import * as Facebook from '../lib/facebook';

export const findById = id => User.findOne({ _id: id });
export const findByEmail = email => User.findOne({ email });

export async function registerBasic(data) {
  const user = await User.create(data);
  return user;
}

export async function userEmailExists(email) {
  const user = await findByEmail(email.toLowerCase());

  return user !== null;
}

export async function loginBasic({ email, password }) {
  const user = await User.findOne({ email, isVerified: true });
  if (!user) {
    return false;
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    return false;
  }

  return user;
}

export async function verifyEmail(email, verificationToken) {
  await User.updateOne(
    { email, verificationToken },
    { isVerified: true, verificationToken: null },
  );
}

export async function loginFacebook(token) {
  const { email, id } = await Facebook.getUserProfile(token);
  let user = await findByEmail(email);

  if (!user) {
    user = await registerBasic({
      email,
      isVerified: true,
      facebookID: id,
    });
  }

  return user;
}
