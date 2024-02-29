const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");
const moment = require("moment");

class Invoices {
  static invoiceModel() {
    return getDB().collection("invoices");
  }

  static async create({ noOrder, orderId, user_id }) {
    const newInvoice = await this.invoiceModel().insertOne({
      noOrder,
      orderId: new ObjectId(orderId),
      user_id: new ObjectId(user_id),
      isPaid: 0,
      paymentDate: "",
      paymentMethod: "",
      paymentProof: "",
      bank: "",
      accountName: "",
      createdAt: moment().format(),
    });

    return newInvoice;
  }

  static async findAll(payload, searchOrder) {
    const { noOrder, user_id, isPaid, startDate, endDate, limit, offset } = payload;
    console.log("[ Payload ]", user_id, isPaid, startDate, endDate);

    const where = {};
    if (!isEmpty(noOrder)) assign(where, { noOrder: { $regex: noOrder, $options: "i" } })
    if (!isEmpty(isPaid)) assign(where, { isPaid: +isPaid });
    if (!isEmpty(user_id)) assign(where, { user_id: new ObjectId(user_id) });
    if (!isEmpty(startDate && endDate)) {
      assign(where, {
        createdAt: {
          $gte: moment(startDate).startOf("day").format(),
          $lte: moment(endDate).endOf("day").format(),
        },
      });
    }

    if (!isEmpty(searchOrder)) {
      return await this.invoiceModel()
        .find(where)
        .sort(searchOrder)
        .skip(+offset)
        .limit(+limit)
        .toArray();
    }

    return await this.invoiceModel()
      .find(where)
      .skip(+offset)
      .limit(+limit)
      .toArray();
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
