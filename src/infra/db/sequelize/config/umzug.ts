import { join } from "path";
import fs from "fs";
import { Sequelize } from "sequelize-typescript";
import { SequelizeStorage, Umzug } from "umzug";

export const sequelize = new Sequelize({ dialect: "sqlite", storage: ":memory:", logging: false });

export const migrator = new Umzug({
  migrations: {
    glob: ['migrations/*.ts', { cwd: join(__dirname, '..') }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
		sequelize,
	}),
  logger: undefined,
  create: {
    folder: "src/infra/db/sequelize/migrations",
    template: (filepath) => [
      [
        filepath,
        fs
          .readFileSync(
            join(__dirname, "..", "template/sample-migration.ts")
          )
          .toString(),
      ],
    ],
  },
});

export type Migration = typeof migrator._types.migration;
