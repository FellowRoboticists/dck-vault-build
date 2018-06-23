SELECT
  p.rowid AS id,
  p.user_id,
  u.email,
  p.application_version,
  STRFTIME('%s', p.createdAt) AS build_timestamp,
  p.be_version,
  p.fe_version,
  p.processed,
  p.error_message,
  p.stdout,
  p.stderr,
  p.processingCompletedAt,
  p.createdAt
FROM
  packages AS p JOIN users AS u ON u.rowid = p.user_id
WHERE
  application_version = $version
