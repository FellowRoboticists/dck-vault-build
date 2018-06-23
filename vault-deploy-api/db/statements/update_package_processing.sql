UPDATE packages SET
  processed = $processed,
  error_message = $error_message,
  stdout = $stdout,
  stderr = $stderr,
  processingCompletedAt = DATETIME('now')
WHERE
  rowid = $id
