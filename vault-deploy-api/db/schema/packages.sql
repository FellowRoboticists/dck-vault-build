CREATE TABLE IF NOT EXISTS packages (
	rowid INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
	application_version TEXT NOT NULL,
	be_version TEXT,
	fe_version TEXT,
	processed INTEGER NOT NULL DEFAULT 0 CHECK (processed IN (0, 1)),
	error_message TEXT,
	stdout TEXT,
	stderr TEXT,
	processingCompletedAt TIMESTAMP,
	createdAt TIMESTAMP DEFAULT (DATETIME('now')),
	PRIMARY KEY (rowid),
	FOREIGN KEY(user_id) REFERENCES users(rowid) ON DELETE CASCADE
);

CREATE TRIGGER IF NOT EXISTS tr_update_be_version AFTER INSERT ON packages WHEN NEW.be_version IS NULL
BEGIN
	UPDATE packages SET be_version = NEW.application_version WHERE rowid = NEW.rowid;
END;

CREATE TRIGGER IF NOT EXISTS tr_update_fe_version AFTER INSERT ON packages WHEN NEW.fe_version IS NULL
BEGIN
	UPDATE packages SET fe_version = NEW.application_version WHERE rowid = NEW.rowid;
END;
