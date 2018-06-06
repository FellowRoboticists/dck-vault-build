SELECT
  rowid AS id,
  email,
  user_role,
  name,
  enabled,
  registered,
  token
FROM
  users
WHERE
  rowid = ?
LIMIT 1

