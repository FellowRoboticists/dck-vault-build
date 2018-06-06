UPDATE users SET
  enabled = $enabled
WHERE
  rowid = $id

