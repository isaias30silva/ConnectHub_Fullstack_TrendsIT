async function getProfile(req, res, next) {
  try {
    const { User } = require("../../models");

    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email"],
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
};
