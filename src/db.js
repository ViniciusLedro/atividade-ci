const Database = require("better-sqlite3");

function criarBanco(arquivo = ":memory:") {
  const db = new Database(arquivo);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      concluida INTEGER NOT NULL DEFAULT 0
    )
  `);

  return db;
}

module.exports = { criarBanco };
