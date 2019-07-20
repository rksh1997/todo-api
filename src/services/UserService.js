import User from '../models/User';

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
  const user = await findByEmail(email.toLowerCase());
  if (!user) {
    return false;
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    return false;
  }

  return user;
}
