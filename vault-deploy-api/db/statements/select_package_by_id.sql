SELECT
  rowid AS id,
  user_id,
  application_version,
  STRFTIME('%s', createdAt) AS build_timestamp,
  be_version,
  fe_version,
  processed,
  error_message,
  stdout,
  stderr,
  processingCompletedAt,
  createdAt
FROM
  packages
WHERE
  rowid = $package_id
LIMIT 1
