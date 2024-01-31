const Kewenangans = require("../models/kewenangan");
const { isEmpty, assign } = require("lodash");

class Kewenangan {
  static async createKewenangan(req, res) {
    const { description } = req.body;
    console.log("[Create Kewenangan]", description);
    try {
      await Kewenangans.create({
        description
      });

      res.status(201).json({
        status: true,
        message: `Kewenangan berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchKewenangans(req, res) {
    console.log("[Fetch All Kewenangans]");
    try {
      const kewenangans = await Kewenangans.findAll();

      if (isEmpty(kewenangans))
        throw {
          status: false,
          error: "Bad Request",
          message: "Kewenangan tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: kewenangans });
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

  static async findKewenangan(req, res) {
    const { id } = req.params;
    try {
      const data = await Kewenangans.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Kewenangan tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: data });
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

  static async updateKewenangan(req, res) {
    const { id } = req.params;
    const { description } = req.body;
    console.log(
      "[Update Kewenangan]",
      id,
      description
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(description)) assign(payload, { description });

      //check if the kewenangan exist or not
      const targetKewenangan = await Kewenangans.findByPk(id);

      if (isEmpty(targetKewenangan))
        throw {
          status: false,
          error: "Bad Request",
          message: "Kewenangan tidak ditemukan",
          result: "",
        };

      await Kewenangans.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Kewenangan berhasil diupdate`,
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

  static async deleteKewenangan(req, res) {
    const { id } = req.params;
    try {
      const targetKewenangan = await Kewenangans.findByPk(id);

      if (isEmpty(targetKewenangan))
        throw {
          status: false,
          error: "Bad Request",
          message: "Kewenangan tidak ditemukan",
          result: "",
        };

      await Kewenangans.destroy(id);

      res.status(200).json({
        status: true,
        message: `Kewenangan dengan id ${id} berhasil dihapus`,
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

module.exports = Kewenangan;
