const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");
const moment = require("moment");

class Articles {
  static articleModel() {
    return getDB().collection("articles");
  }

  static async create({
    articleTitle,
    articleCaption,
    articleDescription,
    articleImage,
  }) {
    const newArticle = await this.articleModel().insertOne({
      articleTitle,
      articleCaption,
      articleDescription,
      articleImage,
      createdAt: moment().format(),
    });
    return newArticle;
  }

  static async findAll(payload, searchOrder) {
    const { articleTitle, startDate, endDate, limit, offset } = payload;
    console.log("[ Payload ]", articleTitle, startDate, endDate, limit, offset);
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(articleTitle))
      assign(where, { articleTitle: { $regex: articleTitle, $options: "i" } });
      if (!isEmpty(startDate && endDate)) {
        assign(where, {
          createdAt: {
            $gte: moment(startDate).startOf("day").format(),
            $lte: moment(endDate).endOf("day").format(),
          },
        });
      }

      console.log(where);

    return await this.articleModel()
      .find(where)
      .sort(searchOrder)
      .skip(+offset)
      .limit(+limit)
      .toArray();
  }

  static async findOne({ articleTitle }) {
    return await this.articleModel().findOne({ articleTitle });
  }

  static async findByPk(id) {
    return await this.articleModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.articleModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.articleModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Articles;
