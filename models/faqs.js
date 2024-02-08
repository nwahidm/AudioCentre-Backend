const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class FAQs {
  static faqsModel() {
    return getDB().collection("faqs");
  }

  static async create({
    description
  }) {
    const newFaqs = await this.faqsModel().insertOne({
      description
    });
    return newFaqs;
  }

  static async findAll(payload) {
    const { description } = payload;
    console.log("[ Payload ]", description);

    const where = {};
    if (!isEmpty(description))
      assign(where, { description: { $regex: description, $options: "i" } });

    return await this.faqsModel().find(where).toArray();
  }

  static async findByPk(id) {
    return await this.faqsModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.faqsModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.faqsModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = FAQs;
