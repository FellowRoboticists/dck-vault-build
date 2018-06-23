-- Used to update the user after a successful registration attempt
UPDATE users SET
  password = $password,
  enabled = 1,
  registered = 1,
  token = NULL
WHERE
  rowid = $id
