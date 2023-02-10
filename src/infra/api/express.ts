import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { clientRoute } from "./routes/client.route";
import { productRoute } from "./routes/product.router";
import { invoiceRoute } from "./routes/invoice.router";
import ClientModel from "../../modules/client-adm/repository/client.model";
import ProductAdminModel from "../../modules/product-adm/repository/product.model";
import CatalogModel from "../../modules/store-catalog/repository/product.model";
import InvoiceModel from "../../modules/invoice/repository/models/invoice.model";
import ItemsModel from "../../modules/invoice/repository/models/product.model";
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
    storage: './database.sqlite',
    logging: false,
  });
  sequelize.addModels([
    ClientModel,
    InvoiceModel,
    ItemsModel,
    ProductAdminModel,
    CatalogModel,
  ]);
  await sequelize.sync({ force: true });
}
setupDb();
