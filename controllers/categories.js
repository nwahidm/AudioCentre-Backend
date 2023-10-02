const Categories = require("../models/categories");
const Subcategories = require("../models/subcategories");
const { isEmpty, assign } = require("lodash");

class Category {
  static async createCategory(req, res) {
    const { categoryName } = req.body;
    const categoryCover = req.files.images;
    console.log("[Create Category]", categoryName, categoryCover);
    try {
      await Categories.create({
        categoryName,
        categoryCover: categoryCover[0].path,
      });

      res.status(201).json({ message: `Category berhasil ditambahkan` });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async fetchCategories(req, res) {
    const { categoryName, order } = req.body;
    console.log("[Fetch All Categories]", categoryName, order);
    try {
      //search query
      const payload = {};
      if (!isEmpty(categoryName)) assign(payload, { categoryName });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { categoryName: order[0].dir };
      }

      const categories = await Categories.findAll(payload, searchOrder);

      if (isEmpty(categories))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Category tidak tersedia",
        };

      res.status(200).json(categories);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async findCategory(req, res) {
    const { id } = req.params;
    try {
      const data = await Categories.findByPk(id);

      if (isEmpty(data))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Category tidak tersedia",
        };

      const payload = { categoryId: id };
      const subcategories = await Subcategories.findAll(payload);

      const category = {
        _id: data._id,
        categoryName: data.categoryName,
        categoryCover: data.categoryCover,
        subcategories,
      };

      res.status(200).json(category);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async updateCategory(req, res) {
    const { id } = req.params;
    const { categoryName } = req.body;
    console.log("[Update Category]", id, categoryName);
    try {
      //update data
      const payload = {};
      if (!isEmpty(categoryName)) assign(payload, { categoryName });

      //check if the category exist or not
      const targetCategory = await Categories.findByPk(id);

      if (isEmpty(targetCategory))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Category tidak ditemukan",
        };

      await Categories.update(id, payload);

      res.status(201).json({ message: `Category berhasil diupdate` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async deleteCategory(req, res) {
    const { id } = req.params;
    try {
      const targetCategory = await Categories.findByPk(id);

      if (isEmpty(targetCategory))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Category tidak ditemukan",
        };

      await Categories.destroy(id);

      res
        .status(200)
        .json({ message: `Category dengan id ${id} berhasil dihapus` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = Category;