const Categories = require("../models/categories");
const Subcategories = require("../models/subcategories");
const { isEmpty, assign, map } = require("lodash");

class Category {
  static async createCategory(req, res) {
    const { categoryName, categorySerialNumber, categoryStatus } = req.body;
    const categoryCover = req.files.images;
    console.log(
      "[Create Category]",
      categoryName,
      categoryCover,
      categorySerialNumber,
      categoryStatus
    );
    try {
      await Categories.create({
        categoryName,
        categoryCover: categoryCover[0].path,
        categorySerialNumber,
        categoryStatus,
      });

      res.status(201).json({
        status: true,
        message: `Category berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchCategories(req, res) {
    const { categoryName, categoryStatus, order } = req.body;
    console.log("[Fetch All Categories]", categoryName, categoryStatus, order);
    try {
      //search query
      const payload = {};
      if (!isEmpty(categoryName)) assign(payload, { categoryName });
      if (!isEmpty(categoryStatus)) assign(payload, { categoryStatus });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        if (order[0].column == 1) searchOrder = { categoryName: order[0].dir };
        else if (order[0].column == 2)
          searchOrder = { categorySerialNumber: order[0].dir };
      }

      const categories = await Categories.findAll(payload, searchOrder);

      if (isEmpty(categories))
        throw {
          status: false,
          error: "Bad Request",
          message: "Category tidak tersedia",
          result: "",
        };

      for (let i = 0; i < categories.length; i++) {
        const payload = { categoryId: categories[i]._id.toString() };
        categories[i].subcategories = await Subcategories.findAll(payload);
        map(categories[i].subcategories, (o) => {
          o.subcategoryCover = `http://202.157.188.101:3000/${o.subcategoryCover}`;
        });
      }

      map(categories, (o) => {
        o.categoryCover = `http://202.157.188.101:3000/${o.categoryCover}`;
      });

      res
        .status(200)
        .json({ status: true, message: "success", result: categories });
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

  static async fetchCategoriesCMS(req, res) {
    const { categoryName, categoryStatus, order } = req.body;
    console.log(
      "[Fetch All Categories CMS]",
      categoryName,
      categoryStatus,
      order
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(categoryName)) assign(payload, { categoryName });
      if (!isEmpty(categoryStatus)) assign(payload, { categoryStatus });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { categoryName: order[0].dir };
      }

      const categories = await Categories.findAll(payload, searchOrder);

      if (isEmpty(categories))
        throw {
          status: false,
          error: "Bad Request",
          message: "Category tidak tersedia",
          result: "",
        };

      map(categories, (o) => {
        o.categoryCover = `http://202.157.188.101:3000/${o.categoryCover}`;
      });

      res
        .status(200)
        .json({ status: true, message: "success", result: categories });
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

  static async findCategory(req, res) {
    const { id } = req.params;
    try {
      const data = await Categories.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Category tidak tersedia",
          result: "",
        };

      const payload = { categoryId: id };
      const subcategories = await Subcategories.findAll(payload);

      map(subcategories, (o) => {
        o.subcategoryCover = `http://202.157.188.101:3000/${o.subcategoryCover}`;
      });

      const category = {
        _id: data._id,
        categoryName: data.categoryName,
        categoryCover: `http://202.157.188.101:3000/${data.categoryCover}`,
        categorySerialNumber: data.categorySerialNumber,
        categoryStatus: data.categoryStatus,
        subcategories,
      };

      res
        .status(200)
        .json({ status: true, message: "success", result: category });
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

  static async updateCategory(req, res) {
    const { id } = req.params;
    const { categoryName, categorySerialNumber, categoryStatus } = req.body;
    let categoryCover;
    if (req.files) {
      categoryCover = req.files.images;
    }
    console.log(
      "[Update Category]",
      id,
      categoryName,
      categorySerialNumber,
      categoryCover,
      categoryStatus
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(categoryName)) assign(payload, { categoryName });
      if (!isEmpty(categoryCover))
        assign(payload, { categoryCover: categoryCover[0].path });
      if (!isEmpty(categorySerialNumber))
        assign(payload, { categorySerialNumber: +categorySerialNumber });
      if (!isEmpty(categoryStatus))
        assign(payload, { categoryStatus: +categoryStatus });

      //check if the category exist or not
      const targetCategory = await Categories.findByPk(id);

      if (isEmpty(targetCategory))
        throw {
          status: false,
          error: "Bad Request",
          message: "Category tidak ditemukan",
          result: "",
        };

      await Categories.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Category berhasil diupdate`,
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

  static async deleteCategory(req, res) {
    const { id } = req.params;
    try {
      const targetCategory = await Categories.findByPk(id);

      if (isEmpty(targetCategory))
        throw {
          status: false,
          error: "Bad Request",
          message: "Category tidak ditemukan",
          result: "",
        };

      await Categories.destroy(id);

      res.status(200).json({
        status: true,
        message: `Category dengan id ${id} berhasil dihapus`,
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

module.exports = Category;
