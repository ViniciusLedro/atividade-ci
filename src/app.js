const express = require("express");
const path = require("path");
const { criarBanco } = require("./db");

function somar(a, b) {
  return Number(a) + Number(b);
}

function criarApp(db) {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      mensagem: "Aplicação funcionando!",
    });
  });

  app.get("/soma/:a/:b", (req, res) => {
    const resultado = somar(req.params.a, req.params.b);

    res.json({ resultado });
  });

  app.get("/tarefas", (req, res) => {
    const tarefas = db.prepare("SELECT * FROM tarefas ORDER BY id").all();

    res.json(tarefas);
  });

  app.get("/tarefas/:id", (req, res) => {
    const tarefa = db
      .prepare("SELECT * FROM tarefas WHERE id = ?")
      .get(req.params.id);

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json(tarefa);
  });

  app.post("/tarefas", (req, res) => {
    const { titulo } = req.body;

    if (typeof titulo !== "string" || titulo.trim() === "") {
      return res.status(400).json({ erro: "Título é obrigatório" });
    }

    const info = db
      .prepare("INSERT INTO tarefas (titulo) VALUES (?)")
      .run(titulo.trim());

    const tarefa = db
      .prepare("SELECT * FROM tarefas WHERE id = ?")
      .get(info.lastInsertRowid);

    res.status(201).json(tarefa);
  });

  app.put("/tarefas/:id", (req, res) => {
    const { titulo, concluida } = req.body;

    if (typeof titulo !== "string" || titulo.trim() === "") {
      return res.status(400).json({ erro: "Título é obrigatório" });
    }

    const info = db
      .prepare("UPDATE tarefas SET titulo = ?, concluida = ? WHERE id = ?")
      .run(titulo.trim(), concluida ? 1 : 0, req.params.id);

    if (info.changes === 0) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    const tarefa = db
      .prepare("SELECT * FROM tarefas WHERE id = ?")
      .get(req.params.id);

    res.json(tarefa);
  });

  app.delete("/tarefas/:id", (req, res) => {
    const info = db
      .prepare("DELETE FROM tarefas WHERE id = ?")
      .run(req.params.id);

    if (info.changes === 0) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.status(204).send();
  });

  app.use(express.static(path.join(__dirname, "../dist")));

  return app;
}

const arquivoBanco =
  process.env.DB_FILE ||
  (process.env.NODE_ENV === "test" ? ":memory:" : "dados.db");

const app = criarApp(criarBanco(arquivoBanco));

module.exports = { app, somar, criarApp };
