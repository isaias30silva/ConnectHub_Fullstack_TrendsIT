async function getProfile(req, res) {
  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
  });
}

module.exports = {
  getProfile,
};
