const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Invoices {
  static invoiceModel() {
    return getDB().collection("invoices");
  }

  static async create({ product, customerData }) {
    const newInvoices = await this.invoiceModel().insertOne({
      product,
      customerData,
      discount: 0,
      isPaid: 0,
    });
    return newInvoices;
  }

  static async findAll(payload, searchOrder) {
    const { name, isPaid } = payload;
    console.log("[ Payload ]", name, isPaid);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(name)) assign(where, { "customerData.name": name });
    if (!isEmpty(isPaid)) assign(where, { isPaid });

    return await this.invoiceModel().find(where).sort(searchOrder).toArray();
  }

  static async findOne({ name }) {
    return await this.invoiceModel().findOne({ "customerData.name": name });
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
