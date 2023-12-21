const Specifications = require("../models/specifications");
const { isEmpty, assign, map } = require("lodash");

class Specification {
  static async createSpecification(req, res) {
    const { specificationName, specificationStatus } = req.body;
    console.log(
      "[Create specification]",
      specificationName,
      specificationStatus
    );
    try {
      await Specifications.create({
        specificationName,
        specificationStatus,
      });

      res.status(201).json({
        status: true,
        message: `specification berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchSpecifications(req, res) {
    const { specificationName, specificationStatus, order } = req.body;
    console.log(
      "[Fetch All specification]",
      specificationName,
      specificationStatus,
      order
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(specificationName)) assign(payload, { specificationName });
      if (!isEmpty(specificationStatus))
        assign(payload, { specificationStatus });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        if (order[0].column == 1)
          searchOrder = { specificationName: order[0].dir };
      }

      const specifications = await Specifications.findAll(payload, searchOrder);

      if (isEmpty(specifications))
        throw {
          status: false,
          error: "Bad Request",
          message: "specification tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: specifications });
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

  static async findSpecification(req, res) {
    const { id } = req.params;
    try {
      const data = await Specifications.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "specification tidak tersedia",
          result: "",
        };

      const specification = {
        _id: data._id,
        specificationName: data.specificationName,
        specificationStatus: data.specificationStatus,
      };

      res
        .status(200)
        .json({ status: true, message: "success", result: specification });
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

  static async updateSpecification(req, res) {
    const { id } = req.params;
    const { specificationName, specificationStatus } = req.body;
    console.log(
      "[Update specification]",
      id,
      specificationName,
      specificationStatus
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(specificationName)) assign(payload, { specificationName });
      if (!isEmpty(specificationStatus))
        assign(payload, { specificationStatus: +specificationStatus });

      //check if the category exist or not
      const targetspecification = await Specifications.findByPk(id);

      if (isEmpty(targetspecification))
        throw {
          status: false,
          error: "Bad Request",
          message: "specification tidak ditemukan",
          result: "",
        };

      await Specifications.update(id, payload);

      res.status(201).json({
        status: true,
        message: `specification berhasil diupdate`,
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

  static async deleteSpecification(req, res) {
    const { id } = req.params;
    try {
      const targetspecification = await Specifications.findByPk(id);

      if (isEmpty(targetspecification))
        throw {
          status: false,
          error: "Bad Request",
          message: "specification tidak ditemukan",
          result: "",
        };

      await Specifications.destroy(id);

      res.status(200).json({
        status: true,
        message: `specification dengan id ${id} berhasil dihapus`,
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

module.exports = Specification;
