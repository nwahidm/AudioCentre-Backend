const Spesifications = require("../models/specifications");
const { isEmpty, assign, map } = require("lodash");

class Spesification {
  static async createSpesification(req, res) {
    const { spesificationName, spesificationStatus } = req.body;
    console.log(
      "[Create Spesification]",
      spesificationName,
      spesificationStatus
    );
    try {
      await Spesifications.create({
        spesificationName,
        spesificationStatus,
      });

      res.status(201).json({
        status: true,
        message: `Spesification berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchSpesifications(req, res) {
    const { spesificationName, spesificationStatus, order } = req.body;
    console.log(
      "[Fetch All Spesification]",
      spesificationName,
      spesificationStatus,
      order
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(spesificationName)) assign(payload, { spesificationName });
      if (!isEmpty(spesificationStatus))
        assign(payload, { spesificationStatus });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        if (order[0].column == 1)
          searchOrder = { spesificationName: order[0].dir };
      }

      const spesifications = await Spesifications.findAll(payload, searchOrder);

      if (isEmpty(spesifications))
        throw {
          status: false,
          error: "Bad Request",
          message: "Spesification tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: spesifications });
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

  static async findSpesification(req, res) {
    const { id } = req.params;
    try {
      const data = await Spesifications.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Spesification tidak tersedia",
          result: "",
        };

      const spesification = {
        _id: data._id,
        spesificationName: data.spesificationName,
        spesificationStatus: data.spesificationStatus,
      };

      res
        .status(200)
        .json({ status: true, message: "success", result: spesification });
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

  static async updateSpesification(req, res) {
    const { id } = req.params;
    const { spesificationName, spesificationStatus } = req.body;
    console.log(
      "[Update Spesification]",
      id,
      spesificationName,
      spesificationStatus
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(spesificationName)) assign(payload, { spesificationName });
      if (!isEmpty(spesificationStatus))
        assign(payload, { spesificationStatus: +spesificationStatus });

      //check if the category exist or not
      const targetSpesification = await Spesifications.findByPk(id);

      if (isEmpty(targetSpesification))
        throw {
          status: false,
          error: "Bad Request",
          message: "Spesification tidak ditemukan",
          result: "",
        };

      await Spesifications.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Spesification berhasil diupdate`,
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

  static async deleteSpesification(req, res) {
    const { id } = req.params;
    try {
      const targetSpesification = await Spesifications.findByPk(id);

      if (isEmpty(targetSpesification))
        throw {
          status: false,
          error: "Bad Request",
          message: "Spesification tidak ditemukan",
          result: "",
        };

      await Spesifications.destroy(id);

      res.status(200).json({
        status: true,
        message: `Spesification dengan id ${id} berhasil dihapus`,
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

module.exports = Spesification;
