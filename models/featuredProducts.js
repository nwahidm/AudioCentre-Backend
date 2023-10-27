const { isEmpty, assign } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class FeaturedProducts {
  static featutedProductModel() {
    return getDB().collection("featuredProducts");
  }

  static async create({
    featuredProductBanner,
    featuredProductStatus,
    productId,
  }) {
    const newFeaturedProduct = await this.featutedProductModel().insertOne({
      featuredProductBanner,
      featuredProductStatus: +featuredProductStatus,
      productId: new ObjectId(productId),
    });
    return newFeaturedProduct;
  }

  static async findAll(payload, searchOrder) {
    const { productId, featuredProductStatus } = payload;
    console.log("[ Payload ]", productId, featuredProductStatus);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(productId))
      assign(where, { productId: new ObjectId(productId) });
    if (!isEmpty(featuredProductStatus))
      assign(where, { featuredProductStatus });

    return await this.featutedProductModel()
      .find(where)
      .sort(searchOrder)
      .toArray();
  }

  static async findOne({ payload }) {
    return await this.featutedProductModel().findOne({ payload });
  }

  static async findByPk(id) {
    return await this.featutedProductModel().findOne({
      _id: new ObjectId(`${id}`),
    });
  }

  static async update(id, payload) {
    return await this.featutedProductModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.featutedProductModel().deleteOne({
      _id: new ObjectId(id),
    });
  }
}

module.exports = FeaturedProducts;
