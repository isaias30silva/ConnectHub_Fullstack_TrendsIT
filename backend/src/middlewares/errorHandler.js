function errorHandler(error, req, res, next) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
  });
}

module.exports = errorHandler;
