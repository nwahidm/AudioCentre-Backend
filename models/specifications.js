const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Spesifications {
  static spesificationModel() {
    return getDB().collection("spesifications");
  }

  static async create({ spesificationName, spesificationStatus }) {
    const newSpesificationn = await this.spesificationModel().insertOne({
      spesificationName,
      spesificationStatus: +spesificationStatus,
    });
    return newSpesificationn;
  }

  static async findAll(payload, searchOrder) {
    const { spesificationName, spesificationStatus } = payload;
    console.log("[ Payload ]", spesificationName, spesificationStatus);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(spesificationName))
      assign(where, {
        spesificationName: { $regex: spesificationName, $options: "i" },
      });
    if (!isEmpty(spesificationStatus))
      assign(where, { spesificationStatus: +spesificationStatus });

    return await this.spesificationModel().find(where).toArray();
  }

  static async findOne({ spesificationName }) {
    return await this.spesificationModel().findOne({ spesificationName });
  }

  static async findByPk(id) {
    return await this.spesificationModel().findOne({
      _id: new ObjectId(`${id}`),
    });
  }

  static async update(id, payload) {
    return await this.spesificationModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.spesificationModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Spesifications;
