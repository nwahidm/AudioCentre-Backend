const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Subcategories {
  static subcategoryModel() {
    return getDB().collection("subcategories");
  }

  static async create({
    subcategoryName,
    categoryId,
    subcategoryCover,
    subcategoryStatus,
  }) {
    const newSubcategory = await this.subcategoryModel().insertOne({
      subcategoryName,
      categoryId: new ObjectId(categoryId),
      subcategoryCover,
      subcategoryStatus: +subcategoryStatus,
    });
    return newSubcategory;
  }

  static async findAll(payload, searchOrder) {
    const { subcategoryName, categoryId } = payload;
    console.log("[ Payload ]", subcategoryName);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(subcategoryName))
      assign(where, {
        subcategoryName: { $regex: subcategoryName, $options: "i" },
      });
    if (!isEmpty(categoryId))
      assign(where, { categoryId: new ObjectId(categoryId) });

    console.log(where);

    return await this.subcategoryModel().find(where).toArray();
  }

  static async findOne({ subcategoryName }) {
    return await this.subcategoryModel().findOne({ subcategoryName });
  }

  static async findByPk(id) {
    return await this.subcategoryModel().findOne({
      _id: new ObjectId(`${id}`),
    });
  }

  static async update(id, payload) {
    return await this.subcategoryModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.subcategoryModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Subcategories;
