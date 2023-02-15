require('ts-node/register');

require('./src/infra/db/sequelize/config/umzug').migrator.runAsCLI();