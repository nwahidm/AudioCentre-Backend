const Subcategories = require("../models/subcategories");
const Categories = require("../models/categories");
const { isEmpty, assign, map, assignIn } = require("lodash");

class Subcategory {
  static async createSubcategory(req, res) {
    const { subcategoryName, categoryId, subcategoryStatus } = req.body;
    const subcategoryCover = req.files.images;
    console.log(
      "[Create Subcategory]",
      subcategoryName,
      categoryId,
      subcategoryCover,
      subcategoryStatus
    );
    try {
      await Subcategories.create({
        subcategoryName,
        categoryId,
        subcategoryCover: subcategoryCover[0].path,
        subcategoryStatus,
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
    const { subcategoryName, subcategoryStatus, order } = req.body;
    console.log(
      "[Fetch All Subcategories]",
      subcategoryName,
      subcategoryStatus,
      order
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(subcategoryName)) assign(payload, { subcategoryName });
      if (!isEmpty(subcategoryStatus)) assign(payload, { subcategoryStatus });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { subcategoryName: order[0].dir };
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
      //   subcategories[i].subcategoryCover = `http://202.157.188.101:3000/${subcategories[i].subcategoryCover}`;
      //   subcategories[i].categoryName = await Categories.findByPk(subcategories[i].categoryId)
      // }
      // map(subcategories, async (o) => {
      //   o.subcategoryCover = `http://202.157.188.101:3000/${o.subcategoryCover}`;
      //   o.categoryName = await Categories.findByPk(o.categoryId)
      // });

      const updatedSubcategories = await Promise.all(
        subcategories.map(async (o) => {
          o.subcategoryCover = `http://202.157.188.101:3000/${o.subcategoryCover}`;
          o.category = await Categories.findByPk(o.categoryId);
          return o;
        })
      );

      res
        .status(200)
        .json({
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
        subcategoryCover: `http://202.157.188.101:3000/${data.subcategoryCover}`,
        subcategoryStatus: data.subcategoriesStatus,
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
    const { subcategoryName, subcategoryStatus } = req.body;
    let subcategoryCover;
    if (req.files) {
      subcategoryCover = req.files.images;
    }
    console.log(
      "[Update Subcategory]",
      id,
      subcategoryName,
      subcategoryCover,
      subcategoryStatus
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(subcategoryName)) assign(payload, { subcategoryName });
      if (!isEmpty(subcategoryCover))
        assign(payload, { subcategoryCover: subcategoryCover[0].path });
      if (!isEmpty(subcategoryStatus))
        assignIn(payload, { subcategoryStatus: +subcategoryStatus });

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
