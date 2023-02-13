import { resolve } from 'path'
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { clientRoute } from "./routes/client.route";
import { productRoute } from "./routes/product.router";
import { invoiceRoute } from "./routes/invoice.router";
import { checkoutRoute } from "./routes/checkout.router";

export const app: Express = express();
app.use(express.json());
app.use("/clients", clientRoute);
app.use("/products", productRoute);
app.use("/invoice", invoiceRoute);
app.use("/checkout", checkoutRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ":memory:",
    logging: false,
  });

  sequelize.addModels([resolve() + '/**/*.model.ts']);
  await sequelize.sync({ force: true });
}
setupDb();
