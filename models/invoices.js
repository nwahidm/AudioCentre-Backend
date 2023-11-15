const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Invoices {
  static invoiceModel() {
    return getDB().collection("invoices");
  }

  static async create({ orderId }) {
    const newInvoice = await this.invoiceModel().insertOne({
      orderId: new ObjectId(orderId),
      isPaid: 0,
    });

    return newInvoice;
  }

  static async findAll(payload) {
    const { isPaid } = payload;
    console.log("[ Payload ]", isPaid);

    const where = {};
    if (!isEmpty(isPaid)) assign(where, { isPaid });

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
