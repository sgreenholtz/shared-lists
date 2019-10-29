CREATE TABLE IF NOT EXISTS list (
	list_id INTEGER PRIMARY KEY,
	alias TEXT NOT NULL,
	private INTEGER NOT NULL,
	synced INTEGER);

CREATE TABLE IF NOT EXISTS list_item (
	list_item_id INTEGER PRIMARY KEY,
	list_id INTEGER,
	text TEXT NOT NULL, 
	synced INTEGER,
	FOREIGN KEY (list_id)
		REFERENCES list (list_id)
);

INSERT INTO list (list_id, alias, private, synced) VALUES (1, 'test-private-unsynced', 1, 0);
INSERT INTO list (list_id, alias, private, synced) VALUES (2, 'test-public-unsynced', 0, 0);
INSERT INTO list (list_id, alias, private, synced) VALUES (3, 'test-private-synced', 1, 1);
INSERT INTO list (list_id, alias, private, synced) VALUES (4, 'test-public-synced', 0, 1);

INSERT INTO list_item (list_id, text, synced) VALUES (1, 'test-1-list-item', 0);
INSERT INTO list_item (list_id, text, synced) VALUES (2, 'test-2-list-item-1', 0);
INSERT INTO list_item (list_id, text, synced) VALUES (2, 'test-2-list-item-2', 0);
INSERT INTO list_item (list_id, text, synced) VALUES (3, 'test-3-list-item', 0);