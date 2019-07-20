import User from '../models/User';

export async function registerBasic(data) {
  const user = await User.create(data);
  return user;
}

export async function userEmailExists(email) {
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  return user !== null;
}

export async function loginBasic({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    return false;
  }

  return user;
}
