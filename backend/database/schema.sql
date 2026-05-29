CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    department_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS event_proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    proposed_date TEXT NOT NULL,
    venue TEXT NOT NULL,
    estimated_budget REAL NOT NULL,
    expected_audience INTEGER NOT NULL,
    department_id INTEGER,
    document_link TEXT,
    status TEXT DEFAULT 'Pending',
    organizer_id INTEGER,
    coordinator_id INTEGER,
    priority TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (organizer_id) REFERENCES users(id),
    FOREIGN KEY (coordinator_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS review_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proposal_id INTEGER,
    reviewer_id INTEGER,
    comment TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (proposal_id) REFERENCES event_proposals(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS proposal_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proposal_id INTEGER,
    action TEXT NOT NULL,
    performed_by INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (proposal_id) REFERENCES event_proposals(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);