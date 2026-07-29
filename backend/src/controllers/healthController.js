function healthCheck(req, res) {
  return res.status(200).json({
    success: true,
    message: "ConnectHub API online",
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  healthCheck,
};
