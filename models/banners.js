const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Banners {
  static bannerModel() {
    return getDB().collection("banners");
  }

  static async create({ bannerName, bannerCover, bannerUrl, status }) {
    const newBanner = await this.bannerModel().insertOne({
      bannerName,
      bannerCover,
      bannerUrl,
      status: +status,
    });
    return newBanner;
  }

  static async findAll(payload, searchOrder) {
    const { bannerName, status, limit, offset } = payload;
    console.log("[ Payload ]", bannerName, status, limit, offset);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(bannerName))
      assign(where, { bannerName: { $regex: bannerName, $options: "i" } });
    if (!isEmpty(status)) assign(where, { status });

    return await this.bannerModel()
      .find(where)
      .sort(searchOrder)
      .skip(+offset)
      .limit(+limit)
      .toArray();
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
