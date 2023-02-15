import { DataTypes } from "sequelize";
import type { Migration } from "../config/umzug";

const tableName = "products";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn(tableName, "salesPrice", {
    type: DataTypes.FLOAT,
    allowNull: false,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn(tableName, "salesPrice");
};
