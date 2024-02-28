const Traffics = require("../models/traffics");
const Products = require("../models/products");
const { isEmpty, assign } = require("lodash");

class Traffic {
  static async createTraffic(req, res) {
    const { product_id } = req.body;
    console.log("[Create Traffic]", product_id);
    try {
      const targetProduct = await Products.findByPk(product_id);

      if (isEmpty(targetProduct))
        throw {
          status: false,
          error: "Bad Request",
          message: "Product tidak tersedia",
          result: "",
        };

      await Traffics.create({
        activity: `${targetProduct.name} diakses`,
        product_id,
      });

      res.status(201).json({
        status: true,
        message: `Traffic berhasil ditambahkan`,
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

  static async fetchTraffics(req, res) {
    const { product_id, activity, startDate, endDate, limit, offset } =
      req.body;
    console.log(
      "[Fetch All Traffics]",
      product_id,
      activity,
      startDate,
      endDate,
      limit,
      offset
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(product_id)) assign(payload, { product_id });
      if (!isEmpty(activity)) assign(payload, { activity });
      if (!isEmpty(startDate)) assign(payload, { startDate });
      if (!isEmpty(endDate)) assign(payload, { endDate });
      if (!isEmpty(limit)) assign(payload, { limit });
      if (!isEmpty(offset)) assign(payload, { offset });

      //order list
      const searchOrder = { createAt: -1 };

      const traffics = await Traffics.findAll(payload, searchOrder);

      if (isEmpty(traffics))
        throw {
          status: false,
          error: "Bad Request",
          message: "Traffic tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: traffics });
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

  static async findTraffic(req, res) {
    const { id } = req.params;
    try {
      const data = await Traffics.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Traffic tidak tersedia",
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

  static async deleteTraffic(req, res) {
    const { id } = req.params;
    try {
      const targetTraffic = await Traffics.findByPk(id);

      if (isEmpty(targetTraffic))
        throw {
          status: false,
          error: "Bad Request",
          message: "Traffic tidak ditemukan",
          result: "",
        };

      await Traffics.destroy(id);

      res.status(200).json({
        status: true,
        message: `Traffic dengan id ${id} berhasil dihapus`,
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

module.exports = Traffic;
