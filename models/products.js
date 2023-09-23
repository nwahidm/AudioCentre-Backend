const { isEmpty, assign } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Products {
  static productModel() {
    return getDB().collection("products");
  }

  static async create({
    brand,
    name,
    description,
    price,
    color,
    category,
    imagePath,
    weight,
    specification,
  }) {
    const newProduct = await this.productModel().insertOne({
      brand,
      name,
      description,
      price: +price,
      color: JSON.parse(color),
      category,
      images: imagePath,
      weight,
      specification: JSON.parse(specification),
    });
    return newProduct;
  }

  static async findAll(payload, searchOrder) {
    const { name, brand, category, minimumPrice, maximumPrice } = payload;
    console.log(
      "[ Payload ]",
      name,
      brand,
      category,
      minimumPrice,
      maximumPrice
    );
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(name)) assign(where, { name });
    if (!isEmpty(brand)) assign(where, { brand });
    if (!isEmpty(category)) assign(where, { category });
    if (!isEmpty(minimumPrice) && !isEmpty(maximumPrice)) {
      assign(where, {
        price: { $gt: Number(minimumPrice), $lt: Number(maximumPrice) },
      });
    }

    return await this.productModel().find(where).sort(searchOrder).toArray();
  }

  static async findOne({ payload }) {
    return await this.productModel().findOne({ payload });
  }

  static async findByPk(id) {
    const data = await this.productModel().findOne({
      _id: new ObjectId(`${id}`),
    });
    return data;
  }

  static async destroy(id) {
    return await this.productModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Products;
