const Subcategories = require("../models/subcategories");
const Categories = require("../models/categories");
const { isEmpty, assign, map, assignIn } = require("lodash");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const url = "https://backend.audiocentre.co.id";

class Subcategory {
  static async createSubcategory(req, res) {
    const {
      subcategoryName,
      categoryId,
      subcategorySerialNumber,
      subcategoryStatus,
      isBuild,
    } = req.body;
    const subcategoryCover = req.files.images;
    console.log(
      "[Create Subcategory]",
      subcategoryName,
      categoryId,
      subcategorySerialNumber,
      subcategoryCover,
      subcategoryStatus,
      isBuild
    );
    try {
      await Subcategories.create({
        subcategoryName,
        categoryId,
        subcategorySerialNumber,
        subcategoryCover: subcategoryCover[0].path,
        subcategoryStatus,
        isBuild,
      });

      res.status(201).json({
        status: true,
        message: `Subcategory berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchSubcategories(req, res) {
    const {
      subcategoryName,
      subcategoryStatus,
      categoryId,
      isBuild,
      order,
      limit,
      offset,
    } = req.body;
    console.log(
      "[Fetch All Subcategories]",
      subcategoryName,
      subcategoryStatus,
      categoryId,
      isBuild,
      order,
      limit,
      offset
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(subcategoryName)) assign(payload, { subcategoryName });
      if (!isEmpty(subcategoryStatus)) assign(payload, { subcategoryStatus });
      if (!isEmpty(categoryId)) assign(payload, { categoryId });
      if (!isEmpty(isBuild)) assign(payload, { isBuild });
      if (!isEmpty(limit)) assign(payload, { limit });
      if (!isEmpty(offset)) assign(payload, { offset });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        if (order[0].column == 1)
          searchOrder = { subcategoryName: order[0].dir };
        else if (order[0].column == 2)
          searchOrder = { subcategorySerialNumber: order[0].dir };
      }

      const subcategories = await Subcategories.findAll(payload, searchOrder);

      if (isEmpty(subcategories))
        throw {
          status: false,
          error: "Bad Request",
          message: "Subcategory tidak tersedia",
          result: "",
        };

      // for (let i in subcategories) {
      //   subcategories[i].subcategoryCover = `${url}/${subcategories[i].subcategoryCover}`;
      //   subcategories[i].categoryName = await Categories.findByPk(subcategories[i].categoryId)
      // }
      // map(subcategories, async (o) => {
      //   o.subcategoryCover = `${url}/${o.subcategoryCover}`;
      //   o.categoryName = await Categories.findByPk(o.categoryId)
      // });

      const updatedSubcategories = await Promise.all(
        subcategories.map(async (o) => {
          o.subcategoryCover = `${url}/${o.subcategoryCover}`;
          o.category = await Categories.findByPk(o.categoryId);
          return o;
        })
      );

      res.status(200).json({
        status: true,
        message: "success",
        result: updatedSubcategories,
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

  static async findSubcategory(req, res) {
    const { id } = req.params;
    try {
      const data = await Subcategories.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Category tidak tersedia",
          result: "",
        };

      const subcategory = {
        _id: data._id,
        subcategoryName: data.subcategoryName,
        subcategoryCover: `${url}/${data.subcategoryCover}`,
        subcategoryStatus: data.subcategoryStatus,
        subcategorySerialNumber: data.subcategorySerialNumber,
        isBuild: data.isBuild,
        categoryId: data.categoryId,
        category: await Categories.findByPk(data.categoryId),
      };

      res
        .status(200)
        .json({ status: true, message: "success", result: subcategory });
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

  static async updateSubcategory(req, res) {
    const { id } = req.params;
    const {
      subcategoryName,
      subcategorySerialNumber,
      subcategoryStatus,
      isBuild,
      categoryId,
    } = req.body;
    let subcategoryCover;
    if (req.files) {
      subcategoryCover = req.files.images;
    }
    console.log(
      "[Update Subcategory]",
      id,
      subcategoryName,
      subcategorySerialNumber,
      subcategoryCover,
      subcategoryStatus,
      isBuild,
      categoryId
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(subcategoryName)) assign(payload, { subcategoryName });
      if (!isEmpty(subcategorySerialNumber))
        assign(payload, { subcategorySerialNumber: +subcategorySerialNumber });
      if (!isEmpty(subcategoryCover))
        assign(payload, { subcategoryCover: subcategoryCover[0].path });
      if (!isEmpty(subcategoryStatus))
        assignIn(payload, { subcategoryStatus: +subcategoryStatus });
      if (!isEmpty(isBuild)) assign(payload, { isBuild: +isBuild });
      if (!isEmpty(categoryId))
        assign(payload, { categoryId: new ObjectId(categoryId) });

      //check if the subcategory exist or not
      const targetSubcategory = await Subcategories.findByPk(id);

      if (isEmpty(targetSubcategory))
        throw {
          status: false,
          error: "Bad Request",
          message: "Subcategory tidak ditemukan",
          result: "",
        };

      await Subcategories.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Subcategory berhasil diupdate`,
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

  static async deleteSubcategory(req, res) {
    const { id } = req.params;
    try {
      const targetSubcategory = await Subcategories.findByPk(id);

      if (isEmpty(targetSubcategory))
        throw {
          status: false,
          error: "Bad Request",
          message: "Subcategory tidak ditemukan",
          result: "",
        };

      fs.unlinkSync(`./${targetSubcategory.subcategoryCover}`);

      await Subcategories.destroy(id);

      res.status(200).json({
        status: true,
        message: `Subcategory dengan id ${id} berhasil dihapus`,
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

module.exports = Subcategory;
