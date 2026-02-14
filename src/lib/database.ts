import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;
let isInitializing = false;
let initPromise: Promise<Database> | null = null;

export async function initDatabase() {
  if (db) {
    console.log("✓ Database already initialized");
    return db;
  }

  if (isInitializing && initPromise) {
    console.log("⏳ Database initialization in progress, waiting...");
    return initPromise;
  }

  isInitializing = true;
  console.log("🔄 Initializing database connection...");

  initPromise = Database.load("sqlite:app.db")
    .then((database) => {
      db = database;
      isInitializing = false;
      console.log("✓ Database connection established");
      return database;
    })
    .catch((error) => {
      isInitializing = false;
      initPromise = null;
      console.error("❌ Failed to initialize database:", error);
      throw error;
    });

  return initPromise;
}

export async function getDatabase() {
  if (!db) {
    await initDatabase();
  }
  return db!;
}

export async function closeDatabase() {
  if (db) {
    try {
      console.log("🔄 Closing database connection...");
      await db.close();
      db = null;
      initPromise = null;
      console.log("✓ Database connection closed");
    } catch (error) {
      console.error("❌ Error closing database:", error);
      throw error;
    }
  }
}

// Example: Create a table
export async function createExampleTable() {
  const database = await getDatabase();
  await database.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Example: Insert data
export async function insertUser(name: string, email: string) {
  const database = await getDatabase();
  const result = await database.execute(
    "INSERT INTO users (name, email) VALUES ($1, $2)",
    [name, email]
  );
  return result;
}

// Example: Query data
export async function getUsers() {
  const database = await getDatabase();
  const users = await database.select<Array<{ id: number; name: string; email: string; created_at: string }>>(
    "SELECT * FROM users"
  );
  return users;
}
