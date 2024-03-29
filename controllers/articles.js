const Articles = require("../models/articles");
const { isEmpty, assign, map } = require("lodash");
const moment = require("moment");
const fs = require("fs");
const url = "https://backend.audiocentre.co.id";

class Article {
  static async createArticle(req, res) {
    const { articleTitle, articleCaption, articleDescription } = req.body;
    const articleImage = req.files.images;
    console.log(
      "[Create Article]",
      articleTitle,
      articleCaption,
      articleDescription,
      articleImage
    );
    try {
      await Articles.create({
        articleTitle,
        articleCaption,
        articleDescription,
        articleImage: articleImage[0].path,
      });

      res.status(201).json({
        status: true,
        message: `Article berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchArticles(req, res) {
    const { articleTitle, startDate, endDate, order, limit, offset } = req.body;
    console.log(
      "[Fetch All Articles]",
      articleTitle,
      startDate,
      endDate,
      order,
      limit,
      offset
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(articleTitle)) assign(payload, { articleTitle });
      if (!isEmpty(startDate)) assign(payload, { startDate });
      if (!isEmpty(endDate)) assign(payload, { endDate });
      if (!isEmpty(limit)) assign(payload, { limit });
      if (!isEmpty(offset)) assign(payload, { offset });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { articleTitle: order[0].dir };
      }

      const data = await Articles.findAll(payload, searchOrder);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Article tidak tersedia",
          result: "",
        };

      map(data, (o) => {
        o.createdAt = moment(o.createdAt).format("MMMM Do YYYY, h:mm:ss a");
        o.articleImage = `${url}/${o.articleImage}`;
      });

      res.status(200).json({ status: true, message: "success", result: data });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }

  static async findArticle(req, res) {
    const { id } = req.params;
    try {
      const data = await Articles.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Article tidak tersedia",
          result: "",
        };

      data.articleImage = `${url}/${data.articleImage}`;
      data.createdAt = moment(data.createdAt).format("MMMM Do YYYY, h:mm:ss a");

      res.status(200).json({ status: true, message: "success", result: data });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }

  static async updateArticle(req, res) {
    const { id } = req.params;
    const { articleTitle, articleCaption, articleDescription } = req.body;
    let articleImage;
    if (req.files) {
      articleImage = req.files.images;
    }
    console.log(
      "[Update Article]",
      id,
      articleTitle,
      articleCaption,
      articleDescription,
      articleImage
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(articleTitle)) assign(payload, { articleTitle });
      if (!isEmpty(articleCaption)) assign(payload, { articleCaption });
      if (!isEmpty(articleDescription)) assign(payload, { articleDescription });
      if (!isEmpty(articleImage))
        assign(payload, { articleImage: articleImage[0].path });

      //check if the article exist or not
      const targetArticle = await Articles.findByPk(id);

      if (isEmpty(targetArticle))
        throw {
          status: false,
          error: "Bad Request",
          message: "Article tidak ditemukan",
          result: "",
        };

      await Articles.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Article berhasil diupdate`,
        result: "",
      });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }

  static async deleteArticle(req, res) {
    const { id } = req.params;
    try {
      const targetArticle = await Articles.findByPk(id);

      if (isEmpty(targetArticle))
        throw {
          status: false,
          error: "Bad Request",
          message: "Article tidak ditemukan",
          result: "",
        };

      fs.unlinkSync(`./${targetArticle.articleImage}`);

      await Articles.destroy(id);

      res.status(200).json({
        status: true,
        message: `Article dengan id ${id} berhasil dihapus`,
        result: "",
      });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }
}

module.exports = Article;
