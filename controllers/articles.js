const Articles = require("../models/articles");
const { isEmpty, assign } = require("lodash");

class Article {
  static async createArticle(req, res) {
    const { articleTitle, articleDescription,  } = req.body;
    const articleImage = req.files.images;
    console.log("[Create Article]", articleTitle, articleDescription, articleImage);
    try {
      await Articles.create({
        articleTitle,
        articleDescription,
        articleImage: articleImage[0].path,
      });

      res.status(201).json({ message: `Article berhasil ditambahkan` });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async fetchArticles(req, res) {
    const { articleTitle, order } = req.body;
    console.log("[Fetch All Articles]", articleTitle, order);
    try {
      //search query
      const payload = {};
      if (!isEmpty(articleTitle)) assign(payload, { articleTitle });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { articleTitle: order[0].dir };
      }

      const articles = await Articles.findAll(payload, searchOrder);

      if (isEmpty(articles))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Article tidak tersedia",
        };

      res.status(200).json(articles);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async findArticle(req, res) {
    const { id } = req.params;
    try {
      const data = await Articles.findByPk(id);

      if (isEmpty(data))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Article tidak tersedia",
        };

      res.status(200).json(data);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async updateArticle(req, res) {
    const { id } = req.params;
    const { articleTitle, articleDescription } = req.body;
    console.log("[Update Article]", id, articleTitle, articleDescription);
    try {
      //update data
      const payload = {};
      if (!isEmpty(articleTitle)) assign(payload, { articleTitle });
      if (!isEmpty(articleDescription)) assign(payload, { articleDescription });

      //check if the article exist or not
      const targetArticle = await Articles.findByPk(id);

      if (isEmpty(targetArticle))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Article tidak ditemukan",
        };

      await Articles.update(id, payload);

      res.status(201).json({ message: `Article berhasil diupdate` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async deleteArticle(req, res) {
    const { id } = req.params;
    try {
      const targetArticle = await Articles.findByPk(id);

      if (isEmpty(targetArticle))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Article tidak ditemukan",
        };

      await Articles.destroy(id);

      res
        .status(200)
        .json({ message: `Article dengan id ${id} berhasil dihapus` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = Article;
