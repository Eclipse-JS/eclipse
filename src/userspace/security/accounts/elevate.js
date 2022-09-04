let newProfile = await users.parseUser(username);

if (!newProfile) {
  return false;
}

newProfile.username = username;

if (account.permLevel == 0) {
  account = newProfile;
  return true;
} else {
  const hashed = await hash.sha512(password);

  if (hashed == newProfile.hashedPassword) {
    account = newProfile;
    return true;
  } else {
    return false;
  }
}
