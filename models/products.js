const { isEmpty, assign } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Products {
  static productModel() {
    return getDB().collection("products");
  }

  static async create({
    name,
    description,
    brandId,
    categoryId,
    subcategoryId,
    price,
    discount,
    variant,
    imagePath,
    weight,
    specification,
    status
  }) {
    const newProduct = await this.productModel().insertOne({
      name,
      description,
      brandId: new ObjectId(brandId),
      categoryId: new ObjectId(categoryId),
      subcategoryId: new ObjectId(subcategoryId),
      price: +price,
      discount: +discount,
      variant: JSON.parse(variant),
      images: imagePath,
      weight,
      specification: JSON.parse(specification),
      status: +status
    });
    return newProduct;
  }

  static async findAll(payload, searchOrder) {
    const { name, brandId, categoryId, subcategoryId, minimumPrice, maximumPrice, limit, offset } = payload;
    console.log(
      "[ Payload ]",
      name,
      brandId,
      categoryId,
      subcategoryId,
      minimumPrice,
      maximumPrice,
      limit,
      offset
    );
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(name)) assign(where, { name: { $regex: name, '$options' : 'i' } });
    if (!isEmpty(brandId)) assign(where, { brandId: new ObjectId(brandId) });
    if (!isEmpty(categoryId)) assign(where, { categoryId: new ObjectId(categoryId) });
    if (!isEmpty(subcategoryId)) assign(where, { subcategoryId: new ObjectId(subcategoryId) });
    if (!isEmpty(minimumPrice) && !isEmpty(maximumPrice)) {
      assign(where, {
        discountPrice: { $gt: Number(minimumPrice), $lt: Number(maximumPrice) },
      });
    }

    return await this.productModel().find(where).sort(searchOrder).skip(+offset).limit(+limit).toArray();
  }

  static async findOne({ payload }) {
    return await this.productModel().findOne({ payload });
  }

  static async findByPk(id) {
    return await this.productModel().findOne({
      _id: new ObjectId(`${id}`),
    });
  }

  static async update(id, payload) {
    return await this.productModel().updateOne(
      { _id: new ObjectId(id) },
      {$set: payload}
    ); 
  }

  static async destroy(id) {
    return await this.productModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Products;
