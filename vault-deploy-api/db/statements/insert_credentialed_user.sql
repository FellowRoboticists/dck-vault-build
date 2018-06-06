INSERT INTO users (
  email,
  password,
  user_role,
  name,
  enabled,
  registered
) VALUES (
  $email, $password, $user_role, $name, $enabled, 1
)
