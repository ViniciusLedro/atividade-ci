const { somar } = require("../../src/app");

describe("Teste unitário da função somar", () => {
  it("deve somar dois números corretamente", () => {
    expect(somar(10, 20)).toBe(30);
  });

  it("deve retornar zero ao somar dois zeros", () => {
    expect(somar(0, 0)).toBe(0);
  });
});
