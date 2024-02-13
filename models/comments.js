const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");
const moment = require("moment");

class Comments {
  static commentModel() {
    return getDB().collection("comments");
  }

  static async create({ productId, comment, customerName }) {
    const newComment = await this.commentModel().insertOne({
      productId: new ObjectId(productId),
      comment,
      customerName,
      replies: "",
      createdAt: moment().format(),
    });
    return newComment;
  }

  static async findAll(payload) {
    const { productId } = payload;
    console.log("[ Payload ]", productId);

    const where = {};
    if (!isEmpty(productId))
      assign(where, { productId: new ObjectId(productId) });

    // return await this.commentModel().find(where).sort({createdAt: 1}).toArray();
    return await this.commentModel()
      .aggregate([
        {
          $match: where,
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
      ])
      .sort({ createdAt: 1 })
      .toArray();
  }

  static async findByPk(id) {
    return await this.commentModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.commentModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.commentModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Comments;
