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

      res
        .status(201)
        .json({
          status: true,
          message: `Brand berhasil ditambahkan`,
          result: "",
        });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
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
          status: false,
          error: "Bad Request",
          message: "Brand tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: brands });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({
            status: false,
            message: "Internal Server Error",
            result: "",
          });
      }
    }
  }

  static async findBrand(req, res) {
    const { id } = req.params;
    try {
      const data = await Brands.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Brand tidak tersedia",
          result: "",
        };

      const brand = {
        _id: data._id,
        brandName: data.brandName,
        brandDescription: data.brandDescription,
        brandCover: data.brandCover,
        brandStatus: data.brandStatus,
      };

      res.status(200).json({ status: true, message: "success", result: brand });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({
            status: false,
            message: "Internal Server Error",
            result: "",
          });
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
          status: false,
          error: "Bad Request",
          message: "Brand tidak ditemukan",
          result: "",
        };

      await Brands.update(id, payload);

      res
        .status(201)
        .json({ status: true, message: `Brand berhasil diupdate`, result: "" });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({
            status: false,
            message: "Internal Server Error",
            result: "",
          });
      }
    }
  }

  static async deleteBrand(req, res) {
    const { id } = req.params;
    try {
      const targetBrand = await Brands.findByPk(id);

      if (isEmpty(targetBrand))
        throw {
          status: false,
          error: "Bad Request",
          message: "Brand tidak ditemukan",
          result: "",
        };

      await Brands.destroy(id);

      res.status(200).json({
        status: true,
        message: `Brand dengan id ${id} berhasil dihapus`,
        result: "",
      });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({
            status: false,
            message: "Internal Server Error",
            result: "",
          });
      }
    }
  }
}

module.exports = Brand;
