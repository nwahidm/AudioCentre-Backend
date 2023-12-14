require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4001;
const { connect } = require("./config");
const multerMiddleware = require("./config/multerConfig");

app.use(
  multerMiddleware.fields([
    { name: "images", maxCount: 10 },
    { name: "variantImages1", maxCount: 5 },
    { name: "variantImages2", maxCount: 5 },
    { name: "variantImages3", maxCount: 5 },
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
app.use("/uploads", express.static(__dirname + `/uploads`));

connect().then(() => {
  app.listen(port, () => {
    console.log(`App Listen at port ${port}`);
  });
});
