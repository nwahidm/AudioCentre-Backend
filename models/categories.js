const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Categories {
  static categoryModel() {
    return getDB().collection("categories");
  }

  static async create({
    categoryName,
    categoryCover,
    categorySerialNumber,
    categoryStatus,
  }) {
    const newCategory = await this.categoryModel().insertOne({
      categoryName,
      categoryCover,
      categorySerialNumber: +categorySerialNumber,
      categoryStatus: +categoryStatus,
    });
    return newCategory;
  }

  static async findAll(payload, searchOrder) {
    const { categoryName, categoryStatus } = payload;
    console.log("[ Payload ]", categoryName, categoryStatus);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(categoryName))
      assign(where, { categoryName: { $regex: categoryName, $options: "i" } });
    if (!isEmpty(categoryStatus))
      assign(where, { categoryStatus: +categoryStatus });

    return await this.categoryModel().find(where).toArray();
  }

  static async findOne({ categoryName }) {
    return await this.categoryModel().findOne({ categoryName });
  }

  static async findByPk(id) {
    return await this.categoryModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.categoryModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.categoryModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Categories;
