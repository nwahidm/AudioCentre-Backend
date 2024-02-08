const Pengembalians = require("../models/pengembalians");
const { isEmpty, assign, map } = require("lodash");

class Pengembalian {
  static async createPengembalian(req, res) {
    const { description } = req.body;
    console.log(
      "[Create Pengembalian]",
      description
    );
    try {
      await Pengembalians.create({
        description
      });

      res.status(201).json({
        status: true,
        message: `Pengembalian berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchPengembalians(req, res) {
    const { description } = req.body;
    console.log("[Fetch All Pengembalians]", description);
    try {
      //search query
      const payload = {};
      if (!isEmpty(description)) assign(payload, { description });

      const pengembalians = await Pengembalians.findAll(payload);

      if (isEmpty(pengembalians))
        throw {
          status: false,
          error: "Bad Request",
          message: "Pengembalian tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: pengembalians });
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

  static async findPengembalian(req, res) {
    const { id } = req.params;
    try {
      const data = await Pengembalians.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Pengembalian tidak tersedia",
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

  static async updatePengembalian(req, res) {
    const { id } = req.params;
    const { description } = req.body;
    console.log(
      "[Update Pengembalian]",
      id,
      description
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(description)) assign(payload, { description });

      //check if the Pengembalian exist or not
      const targetPengembalian = await Pengembalians.findByPk(id);

      if (isEmpty(targetPengembalian))
        throw {
          status: false,
          error: "Bad Request",
          message: "Pengembalian tidak ditemukan",
          result: "",
        };

      await Pengembalians.update(id, payload);

      res
        .status(201)
        .json({ status: true, message: `Pengembalian berhasil diupdate`, result: "" });
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

  static async deletePengembalian(req, res) {
    const { id } = req.params;
    try {
      const targetPengembalian = await Pengembalians.findByPk(id);

      if (isEmpty(targetPengembalian))
        throw {
          status: false,
          error: "Bad Request",
          message: "Pengembalian tidak ditemukan",
          result: "",
        };

      await Pengembalians.destroy(id);

      res.status(200).json({
        status: true,
        message: `Pengembalian dengan id ${id} berhasil dihapus`,
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

module.exports = Pengembalian;
