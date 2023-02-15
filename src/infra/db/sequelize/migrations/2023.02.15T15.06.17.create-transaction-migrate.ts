import { DataTypes } from "sequelize";
import type { Migration } from "../config/umzug";

const tableName = "transactions";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.createTable(tableName, {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.dropTable(tableName);
};
