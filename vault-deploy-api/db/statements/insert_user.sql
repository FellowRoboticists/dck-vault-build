-- Inserts a new user into the users table.
INSERT INTO users (
  email,
  user_role,
  name,
  enabled,
  registered,
  token
) VALUES (
  ?, ?, ?, ?, ?, ?
)
