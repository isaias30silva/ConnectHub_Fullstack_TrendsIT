"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {}

  Transaction.init(
    {
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
    },
  );

  return Transaction;
};
