const Brands = require("../models/brands");
const { isEmpty, assign } = require("lodash");

class Brand {
  static async createBrand(req, res) {
    const { brandName, brandDescription, brandStatus } = req.body;
    const brandCover = req.files.images;
    console.log(
      "[Create Brand]",
      brandName,
      brandDescription,
      brandStatus,
      brandCover
    );
    try {
      await Brands.create({
        brandName,
        brandDescription,
        brandStatus,
        brandCover: brandCover[0].path,
      });

      res.status(201).json({ message: `Brand berhasil ditambahkan` });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async fetchBrands(req, res) {
    const { brandName, brandStatus, order } = req.body;
    console.log("[Fetch All Brands]", brandName, brandStatus, order);
    try {
      //search query
      const payload = {};
      if (!isEmpty(brandName)) assign(payload, { brandName });
      if (!isEmpty(brandStatus)) assign(payload, { brandStatus });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { brandName: order[0].dir };
      }

      const brands = await Brands.findAll(payload, searchOrder);

      if (isEmpty(brands))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Brand tidak tersedia",
        };

      res.status(200).json(brands);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async findBrand(req, res) {
    const { id } = req.params;
    try {
      const data = await Brands.findByPk(id);

      if (isEmpty(data))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Brand tidak tersedia",
        };

      const brand = {
        _id: data._id,
        brandName: data.brandName,
        brandDescription: data.brandDescription,
        brandCover: data.brandCover,
        brandStatus: data.brandStatus,
      };

      res.status(200).json(brand);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async updateBrand(req, res) {
    const { id } = req.params;
    const { brandName, brandDescription, brandStatus } = req.body;
    console.log(
      "[Update Product]",
      id,
      brandName,
      brandDescription,
      brandStatus
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(brandName)) assign(payload, { brandName });
      if (!isEmpty(brandDescription)) assign(payload, { brandDescription });
      if (!isEmpty(brandStatus)) assign(payload, { brandStatus: +brandStatus });

      //check if the brand exist or not
      const targetBrand = await Brands.findByPk(id);

      if (isEmpty(targetBrand))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Brand tidak ditemukan",
        };

      await Brands.update(id, payload);

      res.status(201).json({ message: `Brand berhasil diupdate` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async deleteBrand(req, res) {
    const { id } = req.params;
    try {
      const targetBrand = await Brands.findByPk(id);

      if (isEmpty(targetBrand))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Brand tidak ditemukan",
        };

      await Brands.destroy(id);

      res
        .status(200)
        .json({ message: `Brand dengan id ${id} berhasil dihapus` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = Brand;
