import express, { Express } from "express";
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
