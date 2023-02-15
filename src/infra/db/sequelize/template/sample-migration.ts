import { DataTypes } from "sequelize";
import type { Migration } from "../config/umzug";

const tableName = "foo";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.createTable(tableName, {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.dropTable(tableName);
};
