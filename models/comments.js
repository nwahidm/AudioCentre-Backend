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
    const {
      productId,
      customerName,
      comment,
      startDate,
      endDate,
      limit,
      offset,
    } = payload;
    console.log("[ Payload ]", productId, customerName, comment, limit, offset);

    const where = {};
    if (!isEmpty(customerName))
      assign(where, {
        customerName: { $regex: customerName, $options: "i" },
      });
    if (!isEmpty(comment))
      assign(where, {
        comment: { $regex: comment, $options: "i" },
      });
    if (!isEmpty(productId))
      assign(where, { productId: new ObjectId(productId) });
    if (!isEmpty(startDate && endDate)) {
      assign(where, {
        createdAt: {
          $gte: moment(startDate).format(),
          $lt: moment(endDate).format(),
        },
      });
    }

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
      .skip(offset ? +offset : 0)
      .limit(limit ? +limit : 10000)
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
