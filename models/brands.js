const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Brands {
  static brandModel() {
    return getDB().collection("brands");
  }

  static async create({
    brandName,
    brandDescription,
    brandStatus,
    brandCover,
  }) {
    const newBrand = await this.brandModel().insertOne({
      brandName,
      brandDescription,
      brandCover,
      brandStatus: +brandStatus,
    });
    return newBrand;
  }

  static async findAll(payload, searchOrder) {
    const { brandName, brandStatus, limit, offset } = payload;
    console.log("[ Payload ]", brandName, brandStatus, limit, offset);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(brandName))
      assign(where, { brandName: { $regex: brandName, $options: "i" } });
    if (!isEmpty(brandStatus)) assign(where, { brandStatus: +brandStatus });

    return await this.brandModel()
      .find(where)
      .sort(searchOrder)
      .skip(+offset)
      .limit(+limit)
      .toArray();
  }

  static async find(brandIds) {
    return await this.brandModel()
      .find({ _id: { $in: brandIds } })
      .toArray();
  }

  static async findOne({ brandName }) {
    return await this.brandModel().findOne({ brandName });
  }

  static async findByPk(id) {
    return await this.brandModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.brandModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.brandModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Brands;
