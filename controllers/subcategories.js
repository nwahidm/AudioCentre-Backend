const Subcategories = require("../models/subcategories");
const { isEmpty, assign } = require("lodash");

class Subcategory {
  static async createSubcategory(req, res) {
    const { subcategoryName, categoryId } = req.body;
    const subcategoryCover = req.files.images;
    console.log("[Create Subcategory]", subcategoryName, categoryId, subcategoryCover);
    try {
      await Subcategories.create({
        subcategoryName,
        categoryId,
        subcategoryCover: subcategoryCover[0].path,
      });

      res.status(201).json({ message: `Subcategory berhasil ditambahkan` });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async fetchSubcategories(req, res) {
    const { subcategoryName, order } = req.body;
    console.log("[Fetch All Subcategories]", subcategoryName, order);
    try {
      //search query
      const payload = {};
      if (!isEmpty(subcategoryName)) assign(payload, { subcategoryName });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { subcategoryName: order[0].dir };
      }

      const subcategories = await Subcategories.findAll(payload, searchOrder);

      if (isEmpty(subcategories))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Subcategory tidak tersedia",
        };

      res.status(200).json(subcategories);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async findSubcategory(req, res) {
    const { id } = req.params;
    try {
      const data = await Subcategories.findByPk(id);

      if (isEmpty(data))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Category tidak tersedia",
        };

      const subcategory = {
        _id: data._id,
        subcategoryName: data.subcategoryName,
        subcategoryCover: data.subcategoryCover,
      };

      res.status(200).json(subcategory);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async updateSubcategory(req, res) {
    const { id } = req.params;
    const { subcategoryName } = req.body;
    console.log("[Update Subcategory]", id, subcategoryName);
    try {
      //update data
      const payload = {};
      if (!isEmpty(subcategoryName)) assign(payload, { subcategoryName });

      //check if the category exist or not
      const targetSubcategory = await Subcategories.findByPk(id);

      if (isEmpty(targetSubcategory))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Subcategory tidak ditemukan",
        };

      await Subcategories.update(id, payload);

      res.status(201).json({ message: `Subcategory berhasil diupdate` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async deleteSubcategory(req, res) {
    const { id } = req.params;
    try {
      const targetSubcategory = await Subcategories.findByPk(id);

      if (isEmpty(targetSubcategory))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Subcategory tidak ditemukan",
        };

      await Subcategories.destroy(id);

      res
        .status(200)
        .json({ message: `Subcategory dengan id ${id} berhasil dihapus` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = Subcategory;
