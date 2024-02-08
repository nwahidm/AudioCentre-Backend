const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Layanans {
  static layananModel() {
    return getDB().collection("layanans");
  }

  static async create({
    description
  }) {
    const newLayanan = await this.layananModel().insertOne({
      description
    });
    return newLayanan;
  }

  static async findAll(payload) {
    const { description } = payload;
    console.log("[ Payload ]", description);

    const where = {};
    if (!isEmpty(description))
      assign(where, { description: { $regex: description, $options: "i" } });

    return await this.layananModel().find(where).toArray();
  }

  static async findByPk(id) {
    return await this.layananModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.layananModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.layananModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Layanans;
