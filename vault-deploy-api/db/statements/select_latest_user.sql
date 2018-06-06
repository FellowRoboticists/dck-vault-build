-- Returns the latest user added to the system
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
ORDER BY
  rowid DESC
LIMIT 1
