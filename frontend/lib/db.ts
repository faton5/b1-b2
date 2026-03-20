import { mkdirSync } from "node:fs"
import path from "node:path"
import { DatabaseSync } from "node:sqlite"

type SqlValue = string | number | bigint | Uint8Array | Buffer | null | undefined | boolean | Date
type SqlRow = Record<string, unknown>

const DEFAULT_DATABASE_URL = "file:./data/app.db"

const schema = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    xp_to_next_level INTEGER NOT NULL DEFAULT 500,
    avatar TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

  CREATE TABLE IF NOT EXISTS user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL,
    earned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
  );

  CREATE TABLE IF NOT EXISTS quiz_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL,
    completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS module_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL,
    module_title TEXT NOT NULL,
    xp_earned INTEGER NOT NULL,
    completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id)
  );

  CREATE TABLE IF NOT EXISTS guest_students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class_code TEXT,
    session_token TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS quiz_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    guest_id INTEGER REFERENCES guest_students(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL,
    question_index INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    selected_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct INTEGER NOT NULL,
    answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS game_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    guest_id INTEGER REFERENCES guest_students(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_rounds INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL,
    played_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_transcripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_message TEXT NOT NULL,
    assistant_message TEXT NOT NULL,
    model TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_failures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_message TEXT,
    model TEXT,
    attempt INTEGER NOT NULL DEFAULT 1,
    status_code INTEGER,
    error_message TEXT NOT NULL,
    provider_message TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS student_invite_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    teacher_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    used_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    used_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_chat_failures_created_at ON chat_failures(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_chat_failures_request_id ON chat_failures(request_id);
  CREATE INDEX IF NOT EXISTS idx_student_invite_codes_teacher_user_id ON student_invite_codes(teacher_user_id);
`

function resolveDatabasePath(databaseUrl: string): string {
  if (databaseUrl === ":memory:") {
    return databaseUrl
  }

  if (databaseUrl.startsWith("file:")) {
    const filePath = databaseUrl.slice("file:".length)
    return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath)
  }

  if (databaseUrl.startsWith("sqlite:///")) {
    return databaseUrl.slice("sqlite:///".length)
  }

  return path.isAbsolute(databaseUrl) ? databaseUrl : path.resolve(process.cwd(), databaseUrl)
}

function normalizeValue(value: SqlValue): SqlValue {
  if (value instanceof Date) {
    return value.toISOString().replace("T", " ").replace("Z", "")
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0
  }

  return value ?? null
}

function buildQuery(strings: TemplateStringsArray, values: SqlValue[]) {
  let text = ""

  for (let index = 0; index < strings.length; index += 1) {
    text += strings[index]
    if (index < values.length) {
      text += "?"
    }
  }

  return {
    text: text.trim(),
    values: values.map(normalizeValue),
  }
}

const databasePath = resolveDatabasePath(process.env.DATABASE_URL || DEFAULT_DATABASE_URL)

if (databasePath !== ":memory:") {
  mkdirSync(path.dirname(databasePath), { recursive: true })
}

const db = new DatabaseSync(databasePath)
let isInitialized = false

function initializeDatabase() {
  if (isInitialized) {
    return
  }

  db.exec(`PRAGMA journal_mode = WAL;`)
  db.exec(`PRAGMA busy_timeout = 5000;`)
  db.exec(schema)

  try {
    db.exec(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'student'`)
  } catch {
    // Column already exists on upgraded databases.
  }

  const needsTeacherBackfill = db
    .prepare(`SELECT 1 FROM users WHERE role <> 'teacher' AND lower(email) LIKE '%@prof.com' LIMIT 1`)
    .get() as { 1?: number } | undefined

  if (needsTeacherBackfill) {
    db.exec(`UPDATE users SET role = 'teacher' WHERE role <> 'teacher' AND lower(email) LIKE '%@prof.com'`)
  }

  isInitialized = true
}

async function sql(strings: TemplateStringsArray, ...values: SqlValue[]): Promise<SqlRow[]> {
  initializeDatabase()
  const query = buildQuery(strings, values)
  const statement = db.prepare(query.text)

  if (/^\s*select\b/i.test(query.text) || /\breturning\b/i.test(query.text)) {
    return statement.all(...query.values) as SqlRow[]
  }

  statement.run(...query.values)
  return []
}

export default sql
