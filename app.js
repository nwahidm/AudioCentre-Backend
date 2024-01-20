require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4001;
const { connect } = require("./config");
const multerMiddleware = require("./config/multerConfig");

app.use(
  multerMiddleware.fields([
    { name: "images", maxCount: 10 },
    { name: "productImages0", maxCount: 1 },
    { name: "productImages1", maxCount: 1 },
    { name: "productImages2", maxCount: 1 },
    { name: "productImages3", maxCount: 1 },
    { name: "productImages4", maxCount: 1 },
    { name: "productImages5", maxCount: 1 },
    { name: "productImages6", maxCount: 1 },
    { name: "productImages7", maxCount: 1 },
    { name: "productImages8", maxCount: 1 },
    { name: "productImages9", maxCount: 1 },
    { name: "productImages10", maxCount: 1 },
    { name: "productImages11", maxCount: 1 },
    { name: "productImages12", maxCount: 1 },
    { name: "productImages13", maxCount: 1 },
    { name: "productImages14", maxCount: 1 },
    { name: "productImages15", maxCount: 1 },
    { name: "productImages16", maxCount: 1 },
    { name: "productImages17", maxCount: 1 },
    { name: "productImages18", maxCount: 1 },
    { name: "productImages19", maxCount: 1 },
    { name: "variantImages1", maxCount: 5 },
    { name: "variantImages2", maxCount: 5 },
    { name: "variantImages3", maxCount: 5 },
    { name: "logo1", maxCount: 1 },
    { name: "logo2", maxCount: 1 },
    { name: "logo3", maxCount: 1 },
    { name: "logo4", maxCount: 1 },
    { name: "logo5", maxCount: 1 },
  ])
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", require("./routes/index"));
app.use("/user", require("./routes/users"));
app.use("/banner", require("./routes/banners"));
app.use("/brand", require("./routes/brands"));
app.use("/category", require("./routes/categories"));
app.use("/subcategory", require("./routes/subcategories"));
app.use("/product", require("./routes/products"));
app.use("/notification", require("./routes/notifications"));
app.use("/article", require("./routes/articles"));
app.use("/invoice", require("./routes/invoices"));
app.use("/order", require("./routes/orders"));
app.use("/featured_product", require("./routes/featuredProducts"));
app.use("/specification", require("./routes/specifications"));
app.use("/footer", require("./routes/footers"));
app.use("/uploads", express.static(__dirname + `/uploads`));

connect().then(() => {
  app.listen(port, () => {
    console.log(`App Listen at port ${port}`);
  });
});
