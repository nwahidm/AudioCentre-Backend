const Layanans = require("../models/layanans");
const { isEmpty, assign, map } = require("lodash");

class Layanan {
  static async createLayanan(req, res) {
    const { description } = req.body;
    console.log(
      "[Create Layanan]",
      description
    );
    try {
      await Layanans.create({
        description
      });

      res.status(201).json({
        status: true,
        message: `Layanan berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchLayanans(req, res) {
    const { description } = req.body;
    console.log("[Fetch All Layanans]", description);
    try {
      //search query
      const payload = {};
      if (!isEmpty(description)) assign(payload, { description });

      const layanans = await Layanans.findAll(payload);

      if (isEmpty(layanans))
        throw {
          status: false,
          error: "Bad Request",
          message: "Layanan tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: layanans });
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

  static async findLayanan(req, res) {
    const { id } = req.params;
    try {
      const data = await Layanans.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Layanan tidak tersedia",
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

  static async updateLayanan(req, res) {
    const { id } = req.params;
    const { description } = req.body;
    console.log(
      "[Update Layanan]",
      id,
      description
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(description)) assign(payload, { description });

      //check if the Layanan exist or not
      const targetLayanan = await Layanans.findByPk(id);

      if (isEmpty(targetLayanan))
        throw {
          status: false,
          error: "Bad Request",
          message: "Layanan tidak ditemukan",
          result: "",
        };

      await Layanans.update(id, payload);

      res
        .status(201)
        .json({ status: true, message: `Layanan berhasil diupdate`, result: "" });
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

  static async deleteLayanan(req, res) {
    const { id } = req.params;
    try {
      const targetLayanan = await Layanans.findByPk(id);

      if (isEmpty(targetLayanan))
        throw {
          status: false,
          error: "Bad Request",
          message: "Layanan tidak ditemukan",
          result: "",
        };

      await Layanans.destroy(id);

      res.status(200).json({
        status: true,
        message: `Layanan dengan id ${id} berhasil dihapus`,
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

module.exports = Layanan;
