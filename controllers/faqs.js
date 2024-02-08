const FAQs = require("../models/faqs");
const { isEmpty, assign, map } = require("lodash");

class FAQ {
  static async createFAQ(req, res) {
    const { description } = req.body;
    console.log(
      "[Create FAQ]",
      description
    );
    try {
      await FAQs.create({
        description
      });

      res.status(201).json({
        status: true,
        message: `FAQ berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchFAQs(req, res) {
    const { description } = req.body;
    console.log("[Fetch All FAQs]", description);
    try {
      //search query
      const payload = {};
      if (!isEmpty(description)) assign(payload, { description });

      const faqs = await FAQs.findAll(payload);

      if (isEmpty(faqs))
        throw {
          status: false,
          error: "Bad Request",
          message: "FAQ tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: faqs });
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

  static async findFAQ(req, res) {
    const { id } = req.params;
    try {
      const data = await FAQs.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "FAQ tidak tersedia",
          result: "",
        };

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

  static async updateFAQ(req, res) {
    const { id } = req.params;
    const { description } = req.body;
    console.log(
      "[Update FAQ]",
      id,
      description
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(description)) assign(payload, { description });

      //check if the FAQ exist or not
      const targetFAQ = await FAQs.findByPk(id);

      if (isEmpty(targetFAQ))
        throw {
          status: false,
          error: "Bad Request",
          message: "FAQ tidak ditemukan",
          result: "",
        };

      await FAQs.update(id, payload);

      res
        .status(201)
        .json({ status: true, message: `FAQ berhasil diupdate`, result: "" });
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

  static async deleteFAQ(req, res) {
    const { id } = req.params;
    try {
      const targetFAQ = await FAQs.findByPk(id);

      if (isEmpty(targetFAQ))
        throw {
          status: false,
          error: "Bad Request",
          message: "FAQ tidak ditemukan",
          result: "",
        };

      await FAQs.destroy(id);

      res.status(200).json({
        status: true,
        message: `FAQ dengan id ${id} berhasil dihapus`,
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

module.exports = FAQ;
