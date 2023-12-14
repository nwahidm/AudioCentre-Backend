const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Specifications {
  static specificationModel() {
    return getDB().collection("specifications");
  }

  static async create({ specificationName, specificationStatus }) {
    const newSpecificationn = await this.specificationModel().insertOne({
      specificationName,
      specificationStatus: +specificationStatus,
    });
    return newSpecificationn;
  }

  static async findAll(payload, searchOrder) {
    const { specificationName, specificationStatus } = payload;
    console.log("[ Payload ]", specificationName, specificationStatus);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(specificationName))
      assign(where, {
        specificationName: { $regex: specificationName, $options: "i" },
      });
    if (!isEmpty(specificationStatus))
      assign(where, { specificationStatus: +specificationStatus });

    return await this.specificationModel().find(where).toArray();
  }

  static async findOne({ specificationName }) {
    return await this.specificationModel().findOne({ specificationName });
  }

  static async findByPk(id) {
    return await this.specificationModel().findOne({
      _id: new ObjectId(`${id}`),
    });
  }

  static async update(id, payload) {
    return await this.specificationModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.specificationModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Specifications;
