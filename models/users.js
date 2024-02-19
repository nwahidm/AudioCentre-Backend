const { getDB } = require("../config");
const { ObjectId } = require("mongodb");
const moment = require("moment");
const { isEmpty, assign } = require("lodash");

class Users {
  static userModel() {
    return getDB().collection("users");
  }

  static async create({
    username,
    email,
    password,
    phoneNumber,
    address,
    kewenangan,
  }) {
    const newUser = await this.userModel().insertOne({
      username,
      email,
      password,
      phoneNumber,
      address,
      enabled: true,
      kewenangan: +kewenangan,
      notification: [],
    });
    return newUser;
  }

  static async findAll(payload) {
    const { username, limit, offset } = payload;
    console.log("[Payload]", username, limit, offset);

    const where = {};
    if (!isEmpty(username))
      assign(where, { username: { $regex: username, $options: "i" } });
    return await this.userModel()
      .find(where)
      .skip(+offset)
      .limit(+limit)
      .toArray();
  }

  static async findOne({ email }) {
    return await this.userModel().findOne({ email });
  }

  static async findByPk(id) {
    return await this.userModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.userModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async pushNotificationOrder(orderId) {
    return await this.userModel().updateOne(
      { _id: new ObjectId("653b330e8eb5866dda7cee25") },
      {
        $push: {
          notification: {
            message: "ada pesanan baru",
            orderId,
            createdAt: moment().format(),
          },
        },
      }
    );
  }

  static async pushNotificationComment(commentId) {
    return await this.userModel().updateOne(
      { _id: new ObjectId("653b330e8eb5866dda7cee25") },
      {
        $push: {
          notification: {
            message: "ada komentar baru",
            commentId,
            createdAt: moment().format(),
          },
        },
      }
    );
  }

  static async destroy(id) {
    return await this.userModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Users;
