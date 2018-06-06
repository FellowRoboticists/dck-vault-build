CREATE TABLE IF NOT EXISTS users (
	rowid INTEGER NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT,
	user_role TEXT NOT NULL CHECK (user_role IN ('admin', 'deployer', 'reporter')),
	name TEXT NOT NULL,
	enabled INTEGER NOT NULL CHECK (enabled IN (0,1)),
	registered INTEGER NOT NULL CHECK (registered IN (0,1)),
	token TEXT,
	createdAt TIMESTAMP DEFAULT (DATETIME('now')),
	updatedAt TIMESTAMP DEFAULT (DATETIME('now')),
	PRIMARY KEY (rowid)
);

CREATE TRIGGER IF NOT EXISTS tr_update_user AFTER UPDATE ON users
BEGIN
	UPDATE users SET updatedAt = DATETIME('now') WHERE rowid = NEW.rowid;
END;
