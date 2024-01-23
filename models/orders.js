const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");
const moment = require("moment");

class Orders {
  static orderModel() {
    return getDB().collection("orders");
  }

  static async create({
    fixNoOrder,
    product,
    customerData,
    referenceId,
    discount,
    shipping,
    comment,
    user_id
  }) {
    const newOrder = await this.orderModel().insertOne({
      noOrder: fixNoOrder,
      product,
      customerData,
      discount: discount ? +discount : 0,
      shipping: shipping ? +shipping : 0,
      status: 0,
      referenceId: referenceId ? new ObjectId(referenceId) : null,
      comment: comment? comment : null,
      user_id: user_id? new ObjectId(user_id) : null,
      createdAt: moment().format(),
    });

    return newOrder;
  }

  static async findAll(payload, searchOrder) {
    const { noOrder, name, status, user_id } = payload;
    console.log("[ Payload ]", noOrder, name, status, user_id);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(noOrder)) assign(where, { noOrder: { $regex: noOrder, $options: "i" } })
    if (!isEmpty(name)) assign(where, { "customerData.name": name });
    if (!isEmpty(status)) assign(where, { status: +status });
    if (!isEmpty(user_id)) assign(where, { user_id: new ObjectId(user_id) });

    return await this.orderModel().find(where).sort(searchOrder).toArray();
  }

  static async findOne({ name }) {
    return await this.orderModel().findOne({ "customerData.name": name });
  }

  static async findByPk(id) {
    return await this.orderModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    console.log(payload);
    return await this.orderModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.orderModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Orders;
