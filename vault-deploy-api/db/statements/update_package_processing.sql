UPDATE packages SET
  processed = 1,
  error_message = $error_message,
  stdout = $stdout,
  stderr = $stderr,
  processingCompletedAt = DATETIME('now')
WHERE
  rowid = $id
