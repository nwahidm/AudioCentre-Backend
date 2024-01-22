const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Kewenangans {
  static kewenanganModel() {
    return getDB().collection("kewenangans");
  }

  static async create({ description }) {
    const newKewenangan = await this.kewenanganModel().insertOne({
      description
    });
    return newKewenangan;
  }

  static async findAll() {
    return await this.kewenanganModel().find().toArray();
  }

  static async findOne({ description }) {
    return await this.kewenanganModel().findOne({ description });
  }

  static async findByPk(id) {
    return await this.kewenanganModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.kewenanganModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.kewenanganModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Kewenangans;
