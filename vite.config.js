const { defineConfig } = require("vite");

module.exports = defineConfig({
  test: {
    globals: true,
    enviroment: "node",
  },
});
