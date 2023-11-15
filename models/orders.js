const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Orders {
  static orderModel() {
    return getDB().collection("orders");
  }

  static async create({ product, customerData }) {
    const newOrder = await this.orderModel().insertOne({
      product,
      customerData,
      discount: 0,
      status: 0,
    });

    return newOrder;
  }

  static async findAll(payload, searchOrder) {
    const { name, status } = payload;
    console.log("[ Payload ]", name, status);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(name)) assign(where, { "customerData.name": name });
    if (!isEmpty(status)) assign(where, { status });

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
