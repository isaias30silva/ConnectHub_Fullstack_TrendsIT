require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./src/config/database");

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Banco conectado com sucesso");
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar no banco:", error);
  });

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
