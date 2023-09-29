require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT || 4001;
const { connect } = require("./config");
const multerMiddleware = require("./config/multerConfig");

app.use(multerMiddleware.fields([{ name: "images", maxCount: 10 }]));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", require("./routes/index"));
app.use("/user", require("./routes/users"));
app.use("/product", require("./routes/products"));
app.use("/notification", require("./routes/notifications"));

connect().then(() => {
  app.listen(port, () => {
    console.log(`App Listen at port ${port}`);
  });
});
