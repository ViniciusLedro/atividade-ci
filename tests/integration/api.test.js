const request = require("supertest");
const { app } = require("../../src/app");

describe("Teste de integração da API", () => {
  it("deve retornar uma mensagem na rota principal", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  });

  it("deve realizar uma soma pela API", async () => {
    const response = await request(app).get("/soma/10/20");

    expect(response.status).toBe(200);
    expect(response.body.resultado).toBe(30);
  });
});
