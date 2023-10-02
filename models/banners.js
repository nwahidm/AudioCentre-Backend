const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Banners {
  static bannerModel() {
    return getDB().collection("banners");
  }

  static async create({ bannerName, bannerCover, status }) {
    const newBanner = await this.bannerModel().insertOne({
      bannerName,
      bannerCover,
      status: +status,
    });
    return newBanner;
  }

  static async findAll(payload, searchOrder) {
    const { bannerName, status } = payload;
    console.log("[ Payload ]", bannerName, status);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(bannerName))
      assign(where, { bannerName: { $regex: bannerName, $options: "i" } });
    if (!isEmpty(status)) assign(where, { status });

    return await this.bannerModel().find(where).sort(searchOrder).toArray();
  }

  static async findOne({ bannerName }) {
    return await this.bannerModel().findOne({ bannerName });
  }

  static async findByPk(id) {
    return await this.bannerModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.bannerModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.bannerModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Banners;
