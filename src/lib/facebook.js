import fetch from 'isomorphic-fetch';

export async function getUserProfile(token) {
  const response = await fetch(
    `https://graph.facebook.com/v4.0/me?fields=email&access_token=${token}`,
  );
  const data = await response.json();
  return data;
}
