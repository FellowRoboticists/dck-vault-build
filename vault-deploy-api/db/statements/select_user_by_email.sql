SELECT
  rowid AS id,
  email,
  password,
  user_role,
  name,
  enabled,
  registered,
  token
FROM
  users
WHERE
  email = ?
LIMIT 1
