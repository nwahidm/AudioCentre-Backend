const Comments = require("../models/comments");
const Products = require("../models/products");
const { isEmpty, assign, map } = require("lodash");
const Users = require("../models/users");

class Comment {
  static async createComment(req, res) {
    const { productId, comment, customerName } = req.body;
    console.log("Create Comment", productId, comment, customerName);
    try {
      const targetProduct = await Products.findByPk(productId);

      if (isEmpty(targetProduct))
        throw {
          status: false,
          error: "Bad Request",
          message: "Produk tidak ditemukan",
          result: "",
        };

      const createdComment = await Comments.create({
        productId,
        comment,
        customerName,
      });

      const commentId = createdComment.insertedId;
      await Users.pushNotificationComment(commentId);

      res.status(201).json({
        status: true,
        message: `Comment berhasil ditambahkan`,
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

  static async fetchComments(req, res) {
    const { productId, comment, customerName, limit, offset } = req.body;
    console.log(
      "[Fetch All Comments]",
      productId,
      comment,
      customerName,
      limit,
      offset
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(productId)) assign(payload, { productId });
      if (!isEmpty(comment)) assign(payload, { comment });
      if (!isEmpty(customerName)) assign(payload, { customerName });
      if (!isEmpty(limit)) assign(payload, { limit });
      if (!isEmpty(offset)) assign(payload, { offset });

      const comments = await Comments.findAll(payload);

      if (isEmpty(comments))
        throw {
          status: false,
          error: "Bad Request",
          message: "Comment tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: comments });
    } catch (error) {
      console.log(error);
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

  static async findComment(req, res) {
    const { id } = req.params;
    try {
      const data = await Comments.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Comment tidak tersedia",
          result: "",
        };

      data.product = await Products.findByPk(data.productId);

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

  static async updateComment(req, res) {
    const { id } = req.params;
    const { replies } = req.body;
    console.log("[Update Comment]", id, replies);
    try {
      //update data
      const payload = {};
      if (!isEmpty(replies)) assign(payload, { replies });

      //check if the brand exist or not
      const targetComment = await Comments.findByPk(id);

      if (isEmpty(targetComment))
        throw {
          status: false,
          error: "Bad Request",
          message: "Comment tidak ditemukan",
          result: "",
        };

      await Comments.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Comment berhasil diupdate`,
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

  static async deleteComment(req, res) {
    const { id } = req.params;
    try {
      const targetComment = await Comments.findByPk(id);

      if (isEmpty(targetComment))
        throw {
          status: false,
          error: "Bad Request",
          message: "Comment tidak ditemukan",
          result: "",
        };

      await Comments.destroy(id);

      res.status(200).json({
        status: true,
        message: `Comment dengan id ${id} berhasil dihapus`,
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

module.exports = Comment;
