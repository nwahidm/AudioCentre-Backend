const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Pengembalians {
  static pengembalianModel() {
    return getDB().collection("pengembalians");
  }

  static async create({
    description
  }) {
    const newPengembalian = await this.pengembalianModel().insertOne({
      description
    });
    return newPengembalian;
  }

  static async findAll(payload) {
    const { description } = payload;
    console.log("[ Payload ]", description);

    const where = {};
    if (!isEmpty(description))
      assign(where, { description: { $regex: description, $options: "i" } });

    return await this.pengembalianModel().find(where).toArray();
  }

  static async findByPk(id) {
    return await this.pengembalianModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.pengembalianModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.pengembalianModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Pengembalians;
