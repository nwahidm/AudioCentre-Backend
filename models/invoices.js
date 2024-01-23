const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Invoices {
  static invoiceModel() {
    return getDB().collection("invoices");
  }

  static async create({ orderId, user_id }) {
    const newInvoice = await this.invoiceModel().insertOne({
      orderId: new ObjectId(orderId),
      user_id: new ObjectId(user_id),
      isPaid: 0,
    });

    return newInvoice;
  }

  static async findAll(payload) {
    const { user_id, isPaid } = payload;
    console.log("[ Payload ]", user_id, isPaid);

    const where = {};
    if (!isEmpty(isPaid)) assign(where, { isPaid });
    if (!isEmpty(user_id)) assign(where, { user_id: new ObjectId(user_id) });

    return await this.invoiceModel().find(where).toArray();
  }

  static async findByPk(id) {
    return await this.invoiceModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    console.log(payload);
    return await this.invoiceModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.invoiceModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Invoices;
