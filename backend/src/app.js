const express = require("express");
const cors = require("cors");

const errorHandler = require("./middlewares/errorHandler");
const healthRoutes = require("./routes/healthRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/transactions", transactionRoutes);

app.use(errorHandler);

module.exports = app;
