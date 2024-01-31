const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");
const moment = require("moment");

class Traffics {
  static trafficModel() {
    return getDB().collection("traffics");
  }

  static async create({ activity, product_id }) {
    const newTraffic = await this.trafficModel().insertOne({
      activity,
      product_id: new ObjectId(product_id),
      createdAt: moment().format()
    });
    return newTraffic;
  }

  static async findAll(payload, searchOrder) {
    const { product_id } = payload;
    console.log("[ Payload ]", product_id);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(product_id)) assign(where, { product_id: new ObjectId(product_id) });

    return await this.trafficModel().find(where).sort(searchOrder).toArray();
  }

  static async findByPk(id) {
    return await this.trafficModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async destroy(id) {
    return await this.trafficModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Traffics;
