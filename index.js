const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const productRouters = require("./route/ProductsRoute");
const categoriesRouter = require("./route/CategoryRoute");
const brandsRouter = require("./route/BrandsRoute");
const userRouter = require("./route/UserRoute");
const authRouter = require("./route/AuthRoute");

// for coonect front-end to backend cors modual is neccessury
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); //to parse req.body
server.use("/products", productRouters.router);
server.use("/categories", categoriesRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/users", userRouter.router);
server.use("/auth", authRouter.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecomm");
  console.log("DB connected successfully");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(8080, () => {
  console.log("server started");
});
