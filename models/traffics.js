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
      createdAt: moment().format(),
    });
    return newTraffic;
  }

  static async findAll(payload, searchOrder) {
    const { product_id, activity, startDate, endDate, limit, offset } = payload;
    console.log(
      "[ Payload ]",
      product_id,
      activity,
      startDate,
      endDate,
      limit,
      offset
    );
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(product_id))
      assign(where, { product_id: new ObjectId(product_id) });
    if (!isEmpty(activity))
      assign(where, { activity: { $regex: activity, $options: "i" } });
    if (!isEmpty(startDate && endDate)) {
      assign(where, {
        createdAt: {
          $gte: moment(startDate).format(),
          $lt: moment(endDate).format(),
        },
      });
    }

    return await this.trafficModel()
      .find(where)
      .sort(searchOrder)
      .skip(+offset)
      .limit(+limit)
      .toArray();
  }

  static async findByPk(id) {
    return await this.trafficModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async destroy(id) {
    return await this.trafficModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Traffics;
