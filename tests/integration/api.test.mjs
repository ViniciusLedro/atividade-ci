import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { criarApp } from "../../src/app";
import { criarBanco } from "../../src/db";

describe("API", () => {
  let app;

  beforeEach(() => {
    app = criarApp(criarBanco());
  });

  it("GET / retorna a mensagem de funcionamento", async () => {
    const resposta = await request(app).get("/");

    expect(resposta.status).toBe(200);
    expect(resposta.body.mensagem).toBe("Aplicação funcionando!");
  });

  it("GET /soma/2/3 retorna 5", async () => {
    const resposta = await request(app).get("/soma/2/3");

    expect(resposta.status).toBe(200);
    expect(resposta.body.resultado).toBe(5);
  });

  it("POST /tarefas cria uma tarefa no banco", async () => {
    const resposta = await request(app)
      .post("/tarefas")
      .send({ titulo: "Estudar CI" });

    expect(resposta.status).toBe(201);
    expect(resposta.body.titulo).toBe("Estudar CI");
    expect(resposta.body.concluida).toBe(0);
  });

  it("POST /tarefas sem título retorna 400", async () => {
    const resposta = await request(app).post("/tarefas").send({});

    expect(resposta.status).toBe(400);
  });

  it("GET /tarefas lista as tarefas salvas", async () => {
    await request(app).post("/tarefas").send({ titulo: "Tarefa 1" });
    await request(app).post("/tarefas").send({ titulo: "Tarefa 2" });

    const resposta = await request(app).get("/tarefas");

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(2);
  });

  it("GET /tarefas/:id retorna 404 se não existir", async () => {
    const resposta = await request(app).get("/tarefas/999");

    expect(resposta.status).toBe(404);
  });

  it("PUT /tarefas/:id atualiza a tarefa", async () => {
    const criada = await request(app)
      .post("/tarefas")
      .send({ titulo: "Antiga" });

    const resposta = await request(app)
      .put(`/tarefas/${criada.body.id}`)
      .send({ titulo: "Nova", concluida: true });

    expect(resposta.status).toBe(200);
    expect(resposta.body.titulo).toBe("Nova");
    expect(resposta.body.concluida).toBe(1);
  });

  it("DELETE /tarefas/:id remove a tarefa", async () => {
    const criada = await request(app)
      .post("/tarefas")
      .send({ titulo: "Apagar" });

    const resposta = await request(app).delete(`/tarefas/${criada.body.id}`);
    const busca = await request(app).get(`/tarefas/${criada.body.id}`);

    expect(resposta.status).toBe(204);
    expect(busca.status).toBe(404);
  });
});
