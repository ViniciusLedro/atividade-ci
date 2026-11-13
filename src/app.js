const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

function somar(a, b) {
  return Number(a) + Number(b);
}

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/", (req, res) => {
  res.json({
    mensagem: "Aplicação funcionando!",
  });
});

app.get("/soma/:a/:b", (req, res) => {
  const resultado = somar(req.params.a, req.params.b);

  res.json({ resultado });
});

module.exports = { app, somar };
